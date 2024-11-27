import numpy as np
from scipy.fft import fft
from scipy.stats import entropy
from scipy.signal import butter, lfilter, freqz

import base64
import soundfile as sf

from itertools import permutations


def cut_record(signal, section):
    N = len(signal)
    x = signal[(section-1)*N//3 : section*N//3]
    N1 = len(x)
    x = x[4*N1//10: 9*N1//10]
    return x

def butter_bandpass(lowcut, highcut, fs, order):
    return butter(order, [lowcut, highcut], fs=fs, btype='band')

def butter_bandpass_filter(data, lowcut, highcut, fs, order):
    b, a = butter_bandpass(lowcut, highcut, fs, order=order)
    y = lfilter(b, a, data)
    return y

def generate_z_vectors(y, size=5):
    zs = []
    for i in range(len(y)-size):
        zs.append(y[i:i+size])
    return np.array(zs)

def calculate_PSD_pdf(f):
    N = len(f)
    L = np.arange(1, N//2, dtype=int)
    
    fhat = np.fft.fft(f, N)

    PSD = fhat * np.conj(fhat) / N
    PSD = np.real(PSD[L])
    PSD = PSD / np.sum(PSD)
    PSD = PSD[PSD>10**(-6)]
    PSD = PSD / np.sum(PSD)

    return PSD

def calculate_ordinal_pdf(f, w):
    zs = generate_z_vectors(f, w)
    
    all_patterns = list(permutations(np.arange(w),r=w))
    freqs = np.zeros(len(all_patterns))
    n = len(all_patterns)
    
    patterns, counts = np.unique(np.argsort(zs, axis=1), return_counts=True, axis=0)
    
    for pattern, count in zip(patterns, counts):
        freqs[np.all(all_patterns == pattern, axis=1)] = count
    
    p = freqs / np.sum(freqs)   

    return p

def H(p):
    N = len(p)
    return entropy(p) / np.log(N)

def Hq(p, q):
    return 1/(1-q)*np.log(np.sum(p**q))

def S(p):
    return entropy(p)

def J(p1, p2):
    return S((p1+p2)/2) - S(p1)/2 - S(p2)/2

def C(p):
    N = len(p)
    Q0 = -2 * ((N + 1) / N * np.log(N+1) - 2*np.log(2*N) + np.log(N))**(-1)
    pe = np.full(len(p), 1/len(p))
    Q = J(p, pe) * Q0
    return Q * H(p)

def calculate_entropy_complexity_PSD_windowed(f):
    w = len(f) // 9
    h = len(f) // 18
    es = []
    cs = []
    for i in range(0, len(f)-w+1, h):
        PSD = calculate_PSD_pdf(f[i:i+w])
        es.append(H(PSD))
        cs.append(C(PSD))
    
    return np.min(es), np.min(cs)

def calculate_entropy_complexity_windowed(f, dx):
    w = len(f) // 9
    h = len(f) // 18
    es = []
    cs = []
    for i in range(0, len(f)-w+1, h):
        p = calculate_ordinal_pdf(f[i:i+w], dx)
        es.append(H(p))
        cs.append(C(p))
    
    return np.min(es), np.min(cs)


class FistulaAnalyzer:
    def __init__(self, entropy_crit=0.374, complexity_crit=0.44, kurtosis_crit=None, skew_crit=None, lowcut=10, highcut=300, filter_order=6) -> None:
        self.entropy_crit = entropy_crit
        self.complexity_crit = complexity_crit
        self.kurtosis_crit = kurtosis_crit
        self.skew_crit = skew_crit

        self.lowcut = lowcut
        self.highcut = highcut
        self.filter_order = filter_order

        self.FREQ = 3000


    def b64_to_arr(self, x):
        x_bytes = base64.b64decode(x)
        with open('wav.wav', 'wb') as wf:
            wf.write(x_bytes)
        audio_data, _ = sf.read(file='wav.wav')
        return audio_data

    def analyze(self, item) -> int:
        record = self.b64_to_arr(item['base64Record'])
        # уберём потом, когда не нужно будет сигнал на части бить
        record = cut_record(record, 2)

        # филтрация сигнала от разговоров и т д
        record = butter_bandpass_filter(record, self.lowcut, self.highcut, self.FREQ, self.filter_order)

        e, c = calculate_entropy_complexity_windowed(record, 6)

        if e > self.entropy_crit and c > self.complexity_crit:
            return 1
        else:
            return 0