import { useState, useEffect, useRef } from 'react';
import { ImageIcon, Music, MessageCircle, ChevronLeft, Play, Pause, SkipBack, SkipForward, Battery, Wifi, Signal, User } from 'lucide-react';

const StatusBar = ({ dark = false }: { dark?: boolean }) => {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`h-12 flex justify-between items-center px-6 text-xs font-medium shrink-0 pt-2 ${dark ? 'text-white' : 'text-black'}`}>
      <span>{time}</span>
      <div className="flex space-x-1.5 items-center">
        <Signal size={14} />
        <Wifi size={14} />
        <Battery size={16} />
      </div>
    </div>
  );
};

const AppHeader = ({ title, onBack, dark = false }: { title: string, onBack: () => void, dark?: boolean }) => (
  <div className={`h-14 flex items-center px-2 shrink-0 ${dark ? 'text-white bg-zinc-900' : 'text-black bg-white'} border-b ${dark ? 'border-zinc-800' : 'border-gray-100'}`}>
    <div className={`p-2 cursor-pointer rounded-full transition-colors ${dark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`} onClick={onBack}>
      <ChevronLeft size={28} />
    </div>
    <h1 className="font-bold text-lg ml-1">{title}</h1>
  </div>
);

const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }));
      setDate(now.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '0000') {
          setTimeout(onUnlock, 300);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="w-full h-full bg-white flex flex-col items-center pt-16 relative z-10 transition-all duration-300">
      <div className="text-yellow-500 flex flex-col items-center w-full px-6 mb-10">
        <h1 className="text-6xl font-light mb-2">{time}</h1>
        <p className="text-lg font-medium">{date}</p>
      </div>

      <div className="flex flex-col items-center mt-auto w-full pb-20">
        <p className="text-yellow-500 font-medium mb-6">비밀번호 입력</p>
        <div className={`flex gap-4 mb-10 ${error ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-4 h-4 rounded-full border-2 border-yellow-400 ${i < pin.length ? 'bg-yellow-400' : 'bg-transparent'}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-6 px-10">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button 
              key={num} 
              onClick={() => handleKeyPress(num)}
              className="w-16 h-16 rounded-full bg-yellow-50 text-yellow-600 text-2xl font-light active:bg-yellow-200 transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div />
          <button 
            onClick={() => handleKeyPress('0')}
            className="w-16 h-16 rounded-full bg-yellow-50 text-yellow-600 text-2xl font-light active:bg-yellow-200 transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button 
            onClick={handleDelete}
            className="w-16 h-16 rounded-full text-yellow-600 text-sm font-medium active:bg-yellow-50 transition-colors flex items-center justify-center"
          >
            지우기
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ onOpenApp }: { onOpenApp: (app: string) => void }) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col relative z-10 overflow-y-auto custom-scrollbar pb-10">
      <StatusBar dark />
      <div className="grid grid-cols-4 gap-x-4 gap-y-6 px-6 mt-10">
        <AppIcon icon={<ImageIcon size={30} strokeWidth={1.5} />} name="갤러리" onClick={() => onOpenApp('gallery')} color="bg-gradient-to-br from-blue-400 to-blue-600" />
        <AppIcon icon={<Music size={30} strokeWidth={1.5} />} name="음악" onClick={() => onOpenApp('music')} color="bg-gradient-to-br from-rose-400 to-rose-600" />
        <AppIcon icon={<MessageCircle size={30} strokeWidth={1.5} />} name="메시지" onClick={() => onOpenApp('messages')} color="bg-gradient-to-br from-green-400 to-green-600" />
        <AppIcon icon={<User size={30} strokeWidth={1.5} />} name="프로필" onClick={() => onOpenApp('profile')} color="bg-gradient-to-br from-indigo-400 to-indigo-600" />
      </div>
    </div>
  );
};

const AppIcon = ({ icon, name, onClick, color }: any) => (
  <div className="flex flex-col items-center cursor-pointer group" onClick={onClick}>
    <div className={`w-[60px] h-[60px] rounded-[18px] flex items-center justify-center text-white shadow-lg group-active:scale-95 transition-transform ${color}`}>
      {icon}
    </div>
    <span className="text-white/90 text-[11px] mt-2 font-medium tracking-wide">{name}</span>
  </div>
);

const GalleryApp = ({ onBack }: { onBack: () => void }) => {
  const images = [
    "https://igx.kr/v/35/w/1",
    "https://igx.kr/v/35/w/4",
    "https://igx.kr/v/35/w/7",
    "https://igx.kr/v/35/w/8",
    "https://igx.kr/v/35/w/5"
  ];

  return (
    <div className="w-full h-full bg-white flex flex-col relative z-10 animate-in slide-in-from-right-8 duration-200">
      <StatusBar />
      <AppHeader title="갤러리" onBack={onBack} />
      <div className="flex-1 p-2 grid grid-cols-2 gap-2 overflow-y-auto custom-scrollbar content-start">
        {images.map((src, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <img src={src} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

const MusicApp = ({ onBack }: { onBack: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-zinc-950 text-white flex flex-col relative z-10 animate-in slide-in-from-right-8 duration-200">
      <StatusBar dark />
      <AppHeader title="음악" onBack={onBack} dark />
      <div className="flex-1 flex flex-col items-center px-8 pt-10 pb-8 custom-scrollbar overflow-y-auto">
        <div className="w-56 h-56 rounded-full shadow-2xl flex items-center justify-center mb-10 border-4 border-zinc-800 overflow-hidden relative shrink-0">
          <img src="https://igx.kr/v/35/L/1" alt="Album Cover" className="w-full h-full object-cover" />
        </div>
        <div className="w-full text-left">
          <h2 className="text-2xl font-bold truncate tracking-tight">유래온 플레이리스트</h2>
          <p className="text-zinc-400 mt-1.5 text-sm font-medium">lemon glow</p>
        </div>
        <div className="w-full mt-10">
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-100" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div>
          </div>
          <div className="flex justify-between text-[11px] text-zinc-500 mt-3 font-medium tracking-wide">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-10 w-full mt-10">
          <SkipBack size={32} className="text-white cursor-pointer active:text-zinc-400 transition-colors" fill="currentColor" />
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center cursor-pointer active:scale-95 transition-transform" onClick={togglePlay}>
            {isPlaying ? <Pause size={36} className="text-zinc-950" fill="currentColor" /> : <Play size={36} className="text-zinc-950 ml-1.5" fill="currentColor" />}
          </div>
          <SkipForward size={32} className="text-white cursor-pointer active:text-zinc-400 transition-colors" fill="currentColor" />
        </div>
        
        <audio 
          ref={audioRef} 
          src="https://raw.githubusercontent.com/W4vy0/maids/main/premiummusicodyssey-lemon-glow-441801.mp3"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};

const MessageApp = ({ onBack }: { onBack: () => void }) => {
  const [view, setView] = useState<'list' | 'chat'>('list');

  if (view === 'chat') {
    return (
      <div className="w-full h-full bg-[#abc1d1] flex flex-col relative z-10 animate-in slide-in-from-right-4 duration-200">
        <StatusBar />
        <div className="h-14 border-b border-black/5 flex items-center px-2 bg-[#abc1d1] shrink-0 shadow-sm">
          <div className="p-2 cursor-pointer rounded-full transition-colors active:bg-black/10" onClick={() => setView('list')}>
            <ChevronLeft className="text-slate-800" size={28} />
          </div>
          <div className="ml-1">
            <h2 className="font-bold text-base text-slate-900">크랙대학교 입학처</h2>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="flex justify-center my-3">
            <span className="text-[11px] text-white/90 bg-black/20 px-4 py-1.5 rounded-full font-medium tracking-wide">
              2026년 6월 20일 토요일
            </span>
          </div>
          
          <div className="flex flex-col space-y-1 items-start">
            <div className="bg-white text-gray-900 p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
              <span className="font-bold">[크랙대학교]</span>{'\n'}
              유래온 학생,{'\n'}
              2026학년도 크랙대학교 유아교육학과에 최종 합격하신 것을 진심으로 축하드립니다.
            </div>
            <span className="text-[10px] text-slate-600 ml-1 font-medium">오전 10:00</span>
          </div>
          
          <div className="flex flex-col space-y-1 items-start">
            <div className="bg-white text-gray-900 p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
              <span className="font-bold">[크랙대학교] 신입생 환영회 안내</span>{'\n\n'}
              환영합니다! 신입생 여러분을 위한 환영회가 개최됩니다.{'\n\n'}
              - 일시: 2026년 6월 27일 (토) 14:00{'\n'}
              - 장소: 크랙대학교 체육관{'\n\n'}
              신입생 여러분의 많은 참석 바랍니다.
            </div>
            <span className="text-[10px] text-slate-600 ml-1 font-medium">오전 10:01</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white flex flex-col relative z-10 animate-in slide-in-from-right-8 duration-200">
      <StatusBar />
      <AppHeader title="메시지" onBack={onBack} />
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">
        <div 
          className="flex items-center px-4 py-3 active:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => setView('chat')}
        >
          <div className="w-[50px] h-[50px] rounded-[18px] bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <MessageCircle size={26} strokeWidth={1.5} />
          </div>
          <div className="ml-4 flex-1 overflow-hidden border-b border-gray-100 pb-3">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="font-bold text-[15px] text-gray-900">크랙대학교 입학처</h3>
              <span className="text-[11px] text-gray-400 font-semibold tracking-wide">오전 10:01</span>
            </div>
            <p className="text-sm text-gray-500 truncate font-medium">
              [크랙대학교] 신입생 환영회 안내
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileApp = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="w-full h-full bg-slate-50 flex flex-col relative z-10 animate-in slide-in-from-right-8 duration-200">
      <StatusBar />
      <AppHeader title="프로필" onBack={onBack} />
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="flex flex-col items-center mb-8 pt-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4">
            <img src="https://igx.kr/v/35/L/1" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">유래온</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">20세 (남)</p>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <User size={18} className="mr-2 text-blue-500" />
            기본 정보
          </h3>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">생년월일</span>
              <span className="font-medium">2005년 10월 23일</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">키 / 몸무게</span>
              <span className="font-medium">184cm / 74kg</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">MBTI</span>
              <span className="font-medium">ISTP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">전공</span>
              <span className="font-medium text-right">크랙대학교<br/>유아교육학과</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
          <h3 className="font-bold text-slate-800 mb-3">상세 특징</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            무심, 다정, 집착. 검은 눈, 검은 머리, 검은 티셔츠, 청바지. 무뚝뚝한 말투.
          </p>
          <div className="flex flex-wrap gap-2">
            {['#사디스트', '#디그레이더', '#헌터', '#오너'].map(tag => (
              <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<'lock' | 'home' | 'gallery' | 'music' | 'messages' | 'profile'>('lock');

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* Phone Hardware Shell */}
      <div className="w-full max-w-[390px] h-[844px] bg-black rounded-[3.5rem] p-3 shadow-2xl relative border-[6px] border-zinc-900">
        
        {/* Hardware Buttons */}
        <div className="absolute top-[120px] -left-[8px] w-1 h-8 bg-zinc-800 rounded-l-md"></div>
        <div className="absolute top-[170px] -left-[8px] w-1 h-14 bg-zinc-800 rounded-l-md"></div>
        <div className="absolute top-[240px] -left-[8px] w-1 h-14 bg-zinc-800 rounded-l-md"></div>
        <div className="absolute top-[190px] -right-[8px] w-1 h-20 bg-zinc-800 rounded-r-md"></div>

        {/* Notch / Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-50"></div>

        {/* Screen Area */}
        <div className="w-full h-full bg-black rounded-[2.8rem] overflow-hidden relative">
          
          {screen === 'lock' && <LockScreen onUnlock={() => setScreen('home')} />}
          {screen === 'home' && <HomeScreen onOpenApp={setScreen} />}
          {screen === 'gallery' && <GalleryApp onBack={() => setScreen('home')} />}
          {screen === 'music' && <MusicApp onBack={() => setScreen('home')} />}
          {screen === 'messages' && <MessageApp onBack={() => setScreen('home')} />}
          {screen === 'profile' && <ProfileApp onBack={() => setScreen('home')} />}

        </div>

        {/* Home Indicator */}
        {screen !== 'lock' && (
          <div 
            className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[130px] h-1.5 bg-black/30 dark:bg-white/30 backdrop-blur-sm rounded-full z-50 cursor-pointer"
            onClick={() => setScreen('home')}
          ></div>
        )}
      </div>
    </div>
  );
}
