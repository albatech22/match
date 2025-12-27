import MatchFeed from '@/components/home/MatchFeed'
import Highlights from '@/components/home/Highlights'
import LiveScoreHeader from '@/components/layout/LiveScoreHeader'

export default async function Home() {
  return (
    <main className="min-h-screen bg-black pb-20 overflow-hidden selection:bg-accent-cyan/30">
      <div className="fixed inset-0 bg-[url('/assets/images/noise.png')] opacity-5 pointer-events-none z-50"></div>

      {/* Background Ambient Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-purple/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent-cyan/10 blur-[150px] rounded-full pointer-events-none"></div>



      <div className="pt-2">
        <MatchFeed />
      </div>

      {/* <Highlights /> */}
    </main>
  )
}
