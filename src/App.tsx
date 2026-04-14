import { useState, useEffect } from 'react';
import { auth, db, googleProvider } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from './types';
import { COURSES } from './coursesData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { LogOut, BookOpen, PlayCircle, GraduationCap, User as UserIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    // Listen for profile changes
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        // Create initial profile if it doesn't exist
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Student',
          enrolledAt: new Date().toISOString()
        };
        setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      toast.error("Failed to load profile data");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Welcome to Zayyanu Academy!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const selectCourse = async (courseId: string) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { selectedCourseId: courseId }, { merge: true });
      toast.success("Course selected successfully!");
    } catch (error) {
      toast.error("Failed to select course");
    }
  };

  if (!authReady || (user && loading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <GraduationCap className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-[#666666] text-sm tracking-widest uppercase">Loading Academy</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#111111]">
      <Toaster position="top-center" />
      
      {!user ? (
        <>
          {/* Landing Navbar */}
          <nav className="w-full bg-white border-b border-[#eeeeee]">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex justify-between h-20 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tighter uppercase">ZS Academy</span>
                </div>
                <Button onClick={handleLogin} variant="outline" className="rounded-none border-black hover:bg-black hover:text-white transition-colors">
                  Sign In
                </Button>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-8 py-24">
            <AnimatePresence mode="wait">
              <motion.div 
                key="landing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center py-20"
              >
                <div className="breadcrumb">Communication Masterclass</div>
                <h1 className="max-w-4xl mb-8">
                  Advanced Communication & <br />Public Speaking Strategies
                </h1>
                <p className="text-lg text-[#666666] max-w-xl mb-12 leading-relaxed">
                  Master the psychology of persuasion, effective body language, and the art of storytelling to captivate any audience.
                </p>
                <Button size="lg" onClick={handleLogin} className="rounded-none bg-[#1a1a1a] text-white px-12 h-16 text-lg font-semibold hover:opacity-90 transition-opacity">
                  Start Learning Now
                </Button>
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      ) : (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-[240px] bg-[#fcfcfc] border-r border-[#eeeeee] p-10 flex flex-col shrink-0">
            <div className="text-lg font-bold tracking-tighter uppercase mb-16">ZS Academy</div>
            <nav className="flex-1">
              <ul className="space-y-6">
                <li 
                  className={`text-sm cursor-pointer transition-colors ${profile?.selectedCourseId ? 'text-[#111111] font-bold' : 'text-[#666666] hover:text-[#111111]'}`}
                  onClick={() => {}}
                >
                  My Courses
                </li>
                <li className="text-sm text-[#666666] hover:text-[#111111] cursor-pointer transition-colors">Course Catalog</li>
                <li className="text-sm text-[#666666] hover:text-[#111111] cursor-pointer transition-colors">Resources</li>
                <li className="text-sm text-[#666666] hover:text-[#111111] cursor-pointer transition-colors">Certifications</li>
                <li className="text-sm text-[#666666] hover:text-[#111111] cursor-pointer transition-colors">Settings</li>
              </ul>
            </nav>
            
            <div className="pt-6 border-t border-[#eeeeee] flex items-center gap-3">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.photoURL || ''} />
                <AvatarFallback className="bg-[#eeeeee] text-[10px]"><UserIcon className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-medium truncate">{profile?.displayName}</span>
                <button onClick={handleLogout} className="text-[11px] text-[#666666] hover:text-red-600 text-left transition-colors">Sign Out</button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-white relative">
            <div className="max-w-5xl mx-auto px-24 py-20 min-h-full flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {profile?.selectedCourseId ? (
                  <motion.div
                    key="active-course"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative"
                  >
                    {(() => {
                      const currentCourse = COURSES.find(c => c.id === profile.selectedCourseId);
                      if (!currentCourse) return null;
                      return (
                        <>
                          <div className="breadcrumb">Currently Enrolled</div>
                          <div className="status-badge">
                            <span className="status-dot animate-pulse"></span>
                            Course in progress
                          </div>
                          <h1 className="mb-6">{currentCourse.title}</h1>
                          <p className="text-lg text-[#666666] max-w-[500px] leading-relaxed mb-12">
                            {currentCourse.description}
                          </p>
                          
                          <Button 
                            size="lg" 
                            className="rounded-none bg-[#1a1a1a] text-white px-12 h-16 text-lg font-semibold hover:opacity-90 transition-opacity"
                            onClick={() => window.open(currentCourse.youtubeUrl, '_blank')}
                          >
                            Start Lesson Page
                          </Button>

                          <div className="footer-note">
                            <span><b>Instructor:</b> Zayyanu Sani</span>
                            <span><b>Platform:</b> YouTube Educational Stream</span>
                            <span><b>Duration:</b> 12 Modules</span>
                          </div>

                          {/* Course Preview Box */}
                          <div className="hidden xl:flex absolute bottom-0 right-[-40px] w-[280px] h-[160px] bg-[#f0f0f0] border border-[#eeeeee] rounded-lg items-center justify-center overflow-hidden group cursor-pointer shadow-sm" onClick={() => window.open(currentCourse.youtubeUrl, '_blank')}>
                            <img 
                              src={currentCourse.thumbnail} 
                              alt="Preview" 
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                              referrerPolicy="no-referrer"
                            />
                            <div className="relative z-10 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                              <PlayCircle className="w-6 h-6 text-black" />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <motion.div
                    key="catalog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="breadcrumb">Academy Catalog</div>
                    <h1 className="mb-12">Available Courses</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {COURSES.map((course) => (
                        <div key={course.id} className="group cursor-pointer" onClick={() => selectCourse(course.id)}>
                          <div className="aspect-video bg-[#f0f0f0] mb-6 overflow-hidden border border-[#eeeeee]">
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:underline underline-offset-4">{course.title}</h3>
                          <p className="text-sm text-[#666666] leading-relaxed">{course.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
