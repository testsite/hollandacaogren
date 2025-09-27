class GuitarTuner {
    constructor() {
        // Audio context ve analiz araçları
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.isListening = false;
        
        // Akort ayarları
        this.A4 = 440; // A4 frekansı
        this.sensitivity = 5;
        this.sampleRate = 44100;
        this.bufferLength = 4096;
        
        // UI elementleri
        this.elements = {
            startBtn: document.getElementById('start-tuner'),
            stopBtn: document.getElementById('stop-tuner'),
            currentNote: document.getElementById('current-note'),
            frequency: document.getElementById('frequency'),
            meterNeedle: document.getElementById('meter-needle'),
            ledFlat: document.getElementById('led-flat'),
            ledPerfect: document.getElementById('led-perfect'),
            ledSharp: document.getElementById('led-sharp'),
            tuningMode: document.getElementById('tuning-mode'),
            notesGrid: document.getElementById('notes-grid'),
            a4Frequency: document.getElementById('a4-frequency'),
            a4Value: document.getElementById('a4-value'),
            sensitivitySlider: document.getElementById('sensitivity'),
            sensitivityValue: document.getElementById('sensitivity-value')
        };
        
        // Enstrüman ayarları
        this.tunings = {
            guitar: {
                name: 'Gitar',
                notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
                frequencies: [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]
            },
            bass: {
                name: 'Bas Gitar',
                notes: ['E1', 'A1', 'D2', 'G2'],
                frequencies: [41.20, 55.00, 73.42, 98.00]
            },
            ukulele: {
                name: 'Ukulele',
                notes: ['G4', 'C4', 'E4', 'A4'],
                frequencies: [392.00, 261.63, 329.63, 440.00]
            },
            violin: {
                name: 'Keman',
                notes: ['G3', 'D4', 'A4', 'E5'],
                frequencies: [196.00, 293.66, 440.00, 659.25]
            }
        };
        
        // Nota isimleri
        this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateTuningDisplay();
        this.updateA4Display();
        this.updateSensitivityDisplay();
    }
    
    setupEventListeners() {
        // Akort kontrolleri
        this.elements.startBtn.addEventListener('click', () => this.startTuning());
        this.elements.stopBtn.addEventListener('click', () => this.stopTuning());
        
        // Enstrüman değişikliği
        this.elements.tuningMode.addEventListener('change', () => this.updateTuningDisplay());
        
        // Ayarlar
        this.elements.a4Frequency.addEventListener('input', (e) => {
            this.A4 = parseInt(e.target.value);
            this.updateA4Display();
        });
        
        this.elements.sensitivitySlider.addEventListener('input', (e) => {
            this.sensitivity = parseInt(e.target.value);
            this.updateSensitivityDisplay();
        });
    }
    
    updateTuningDisplay() {
        const selectedTuning = this.tunings[this.elements.tuningMode.value];
        this.elements.notesGrid.innerHTML = '';
        
        selectedTuning.notes.forEach((note, index) => {
            const noteButton = document.createElement('div');
            noteButton.className = 'note-button';
            noteButton.innerHTML = `
                <div>${note}</div>
                <div style="font-size: 0.8em; opacity: 0.8;">${selectedTuning.frequencies[index].toFixed(1)} Hz</div>
            `;
            this.elements.notesGrid.appendChild(noteButton);
        });
    }
    
    updateA4Display() {
        this.elements.a4Value.textContent = `${this.A4} Hz`;
    }
    
    updateSensitivityDisplay() {
        this.elements.sensitivityValue.textContent = this.sensitivity;
    }
    
    async startTuning() {
        try {
            // Mikrofon erişimi iste
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    noiseSuppression: false
                } 
            });
            
            // Audio context oluştur
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            
            // Analiz ayarları
            this.analyser.fftSize = this.bufferLength * 2;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Mikrofonu analizöre bağla
            this.microphone.connect(this.analyser);
            
            // Data array oluştur
            this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
            
            this.isListening = true;
            this.elements.startBtn.disabled = true;
            this.elements.stopBtn.disabled = false;
            
            // Analiz döngüsünü başlat
            this.analyzeAudio();
            
        } catch (error) {
            console.error('Mikrofon erişimi başarısız:', error);
            
            let errorMessage = 'Mikrofon erişimi başarısız! ';
            
            if (error.name === 'NotAllowedError') {
                errorMessage += 'Lütfen mikrofon iznini verin ve sayfayı yenileyin.';
            } else if (error.name === 'NotFoundError') {
                errorMessage += 'Mikrofon bulunamadı. Lütfen mikrofonunuzun bağlı olduğundan emin olun.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage += 'Tarayıcınız mikrofon erişimini desteklemiyor.';
            } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
                errorMessage += 'HTTPS bağlantısı gerekli. Lütfen güvenli bir bağlantı kullanın.';
            } else {
                errorMessage += 'Bilinmeyen bir hata oluştu. Lütfen tarayıcınızı güncelleyin.';
            }
            
            alert(errorMessage);
            
            // UI'ı sıfırla
            this.elements.startBtn.disabled = false;
            this.elements.stopBtn.disabled = true;
        }
    }
    
    stopTuning() {
        this.isListening = false;
        
        if (this.microphone) {
            this.microphone.disconnect();
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        // UI'ı sıfırla
        this.elements.startBtn.disabled = false;
        this.elements.stopBtn.disabled = true;
        this.elements.currentNote.textContent = '-';
        this.elements.frequency.textContent = '0 Hz';
        this.resetMeter();
        this.resetLEDs();
    }
    
    analyzeAudio() {
        if (!this.isListening) return;
        
        // Frekans verilerini al
        this.analyser.getFloatTimeDomainData(this.dataArray);
        
        // Pitch detection
        const frequency = this.detectPitch(this.dataArray);
        
        if (frequency > 50 && frequency < 2000) { // Geçerli frekans aralığı
            const note = this.frequencyToNote(frequency);
            const cents = this.getCentsOffPitch(frequency, note.frequency);
            
            this.updateDisplay(note, frequency, cents);
        } else {
            this.elements.currentNote.textContent = '-';
            this.elements.frequency.textContent = '0 Hz';
            this.resetMeter();
            this.resetLEDs();
        }
        
        // Bir sonraki frame'de tekrar çalıştır
        requestAnimationFrame(() => this.analyzeAudio());
    }
    
    detectPitch(data) {
        // Autocorrelation pitch detection algoritması (optimize edilmiş)
        const bufferSize = data.length;
        const autocorrelation = new Float32Array(bufferSize);
        
        // İlk önce RMS kontrolü - ses seviyesi çok düşükse işlem yapma
        let rms = 0;
        for (let i = 0; i < bufferSize; i++) {
            rms += data[i] * data[i];
        }
        rms = Math.sqrt(rms / bufferSize);
        
        if (rms < 0.01) return 0; // Çok sessiz
        
        // Autocorrelation hesapla (sadece gerekli aralık için)
        const minLag = Math.floor(this.audioContext.sampleRate / 800); // En yüksek frekans ~800Hz
        const maxLag = Math.floor(this.audioContext.sampleRate / 50);  // En düşük frekans ~50Hz
        
        for (let lag = minLag; lag < Math.min(maxLag, bufferSize / 2); lag++) {
            let sum = 0;
            for (let i = 0; i < bufferSize - lag; i++) {
                sum += data[i] * data[i + lag];
            }
            autocorrelation[lag] = sum;
        }
        
        // En yüksek peak'i bul
        let maxCorrelation = 0;
        let bestLag = 0;
        
        for (let lag = minLag; lag < Math.min(maxLag, bufferSize / 2); lag++) {
            if (autocorrelation[lag] > maxCorrelation && autocorrelation[lag] > 0.3) {
                maxCorrelation = autocorrelation[lag];
                bestLag = lag;
            }
        }
        
        // Parabolic interpolation ile daha hassas frekans hesapla
        if (bestLag > 0 && bestLag < autocorrelation.length - 1) {
            const y1 = autocorrelation[bestLag - 1] || 0;
            const y2 = autocorrelation[bestLag];
            const y3 = autocorrelation[bestLag + 1] || 0;
            
            const a = (y1 - 2 * y2 + y3) / 2;
            const b = (y3 - y1) / 2;
            
            if (a !== 0) {
                const xv = -b / (2 * a);
                const betterLag = bestLag + xv;
                return this.audioContext.sampleRate / betterLag;
            }
            
            return this.audioContext.sampleRate / bestLag;
        }
        
        return 0;
    }
    
    frequencyToNote(frequency) {
        // Frekansı nota çevir
        const A4Index = 9; // A notası dizinde 9. index
        const noteNumber = 12 * Math.log2(frequency / this.A4) + A4Index;
        const noteIndex = Math.round(noteNumber) % 12;
        const octave = Math.floor((Math.round(noteNumber) + 3) / 12);
        
        const noteName = this.noteNames[noteIndex < 0 ? noteIndex + 12 : noteIndex];
        const exactFrequency = this.A4 * Math.pow(2, (Math.round(noteNumber) - A4Index) / 12);
        
        return {
            name: noteName,
            octave: octave,
            frequency: exactFrequency,
            cents: this.getCentsOffPitch(frequency, exactFrequency)
        };
    }
    
    getCentsOffPitch(frequency, targetFrequency) {
        // Cent cinsinden sapma hesapla (100 cent = 1 semitone)
        return Math.floor(1200 * Math.log2(frequency / targetFrequency));
    }
    
    updateDisplay(note, frequency, cents) {
        // Nota ve frekans göster
        this.elements.currentNote.textContent = `${note.name}${note.octave}`;
        this.elements.frequency.textContent = `${frequency.toFixed(1)} Hz`;
        
        // Animasyon ekle
        this.elements.currentNote.classList.add('detected');
        setTimeout(() => {
            this.elements.currentNote.classList.remove('detected');
        }, 300);
        
        // Meter güncelle
        this.updateMeter(cents);
        
        // LED'leri güncelle
        this.updateLEDs(cents);
        
        // Hedef notaları vurgula
        this.highlightTargetNote(note);
    }
    
    updateMeter(cents) {
        // Meter iğnesini hareket ettir (-50 ile +50 cent arası)
        const clampedCents = Math.max(-50, Math.min(50, cents));
        const rotation = (clampedCents / 50) * 45; // -45° ile +45° arası
        this.elements.meterNeedle.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
    }
    
    updateLEDs(cents) {
        this.resetLEDs();
        
        const tolerance = 10 - this.sensitivity; // Hassasiyet ayarı
        
        if (Math.abs(cents) <= tolerance) {
            this.elements.ledPerfect.classList.add('active');
        } else if (cents < -tolerance) {
            this.elements.ledFlat.classList.add('active');
        } else if (cents > tolerance) {
            this.elements.ledSharp.classList.add('active');
        }
    }
    
    resetMeter() {
        this.elements.meterNeedle.style.transform = 'translateX(-50%) rotate(0deg)';
    }
    
    resetLEDs() {
        this.elements.ledFlat.classList.remove('active');
        this.elements.ledPerfect.classList.remove('active');
        this.elements.ledSharp.classList.remove('active');
    }
    
    highlightTargetNote(detectedNote) {
        // Önceki vurguları temizle
        document.querySelectorAll('.note-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mevcut tuning'deki notaları kontrol et
        const selectedTuning = this.tunings[this.elements.tuningMode.value];
        const noteButtons = document.querySelectorAll('.note-button');
        
        selectedTuning.notes.forEach((targetNote, index) => {
            const targetNoteName = targetNote.replace(/\d+$/, ''); // Oktav numarasını kaldır
            const detectedNoteName = detectedNote.name;
            
            if (targetNoteName === detectedNoteName && noteButtons[index]) {
                noteButtons[index].classList.add('active');
            }
        });
    }
}

// Sayfa yüklendiğinde tuner'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new GuitarTuner();
});

// PWA desteği için service worker kayıt
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}