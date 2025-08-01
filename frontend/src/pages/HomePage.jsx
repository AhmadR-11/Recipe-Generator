import { Button } from '@/components/ui/button'
import { ChefHat, Sparkles, Clock, Heart, Star, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <ChefHat className="h-10 w-10 text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  AI Recipe Generator
                </span>
                <div className="text-xs text-slate-400 font-medium">Powered by AI</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 hover:border-emerald-400 transition-all duration-300"
              onClick={() => window.location.href = '/login'}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center relative">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <ChefHat className="h-16 w-16 text-emerald-400" />
                <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
                <Zap className="h-6 w-6 text-blue-400 absolute -bottom-1 -left-1 animate-pulse" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent">
                Smart Recipe
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Generator
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your leftover ingredients into culinary masterpieces with our 
              <span className="text-emerald-400 font-semibold"> AI-powered cooking assistant</span>. 
              Never wonder "what to cook" again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                onClick={() => window.location.href = '/login'}
              >
                Start Cooking Magic ✨
              </Button>
              <div className="flex items-center space-x-1 text-slate-400">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-2 text-sm">Loved by 10k+ home chefs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-500">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-emerald-500/20 rounded-xl">
                  <Sparkles className="h-12 w-12 text-emerald-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Intelligence</h3>
              <p className="text-slate-300 leading-relaxed">
                Our advanced machine learning algorithms understand flavor profiles, 
                cooking techniques, and ingredient combinations to create perfect recipes.
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-500/20 rounded-xl">
                  <Clock className="h-12 w-12 text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-slate-300 leading-relaxed">
                Get personalized recipe suggestions in under 3 seconds. Complete with 
                prep time, difficulty level, and detailed cooking instructions.
              </p>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
            <div className="relative p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:border-pink-500/30 transition-all duration-500">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-pink-500/20 rounded-xl">
                  <Heart className="h-12 w-12 text-pink-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Deeply Personal</h3>
              <p className="text-slate-300 leading-relaxed">
                Accommodates all dietary needs - vegan, keto, gluten-free, allergies. 
                Your health and preferences always come first.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-teal-500/20 rounded-3xl"></div>
          <div className="relative p-16 text-center">
            <div className="absolute top-6 right-6">
              <Sparkles className="h-8 w-8 text-emerald-200 animate-pulse" />
            </div>
            <div className="absolute bottom-6 left-6">
              <Star className="h-6 w-6 text-yellow-300 animate-bounce" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to revolutionize your kitchen?
            </h2>
            <p className="text-xl mb-8 text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Join our community of passionate home cooks who've discovered the joy of 
              effortless meal planning and creative cooking.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-emerald-700 hover:bg-slate-100 px-12 py-4 text-lg font-bold rounded-xl shadow-2xl hover:shadow-white/25 transition-all duration-300"
              onClick={() => window.location.href = '/login'}
            >
              Begin Your Culinary Journey 🚀
            </Button>
            
            <div className="mt-8 flex justify-center items-center space-x-8 text-emerald-200">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm">Recipes Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm">Happy Cooks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-sm">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}