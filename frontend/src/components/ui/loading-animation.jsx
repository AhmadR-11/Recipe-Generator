import { motion } from "framer-motion";
import { ChefHat, Utensils, Sparkles } from "lucide-react";

export function LoadingAnimation({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Main chef hat */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10"
        >
          <ChefHat className="h-16 w-16 text-emerald-600" />
        </motion.div>

        {/* Floating utensils */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-2 -right-2"
        >
          <Utensils className="h-6 w-6 text-emerald-500" />
        </motion.div>

        {/* Sparkles */}
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-1 -left-2"
        >
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </motion.div>

        {/* Floating dots */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 bg-emerald-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-lg font-medium text-emerald-700"
        >
          {message}
        </motion.p>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-emerald-500 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export function RecipeGeneratingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
      <div className="relative">
        {/* Cooking pot */}
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative"
        >
          <div className="w-20 h-16 bg-gray-700 rounded-b-full relative">
            {/* Steam */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, -40],
                    opacity: [1, 0.5, 0],
                    scale: [0.5, 1, 1.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                  className="absolute w-3 h-3 bg-white rounded-full"
                  style={{ left: `${i * 8 - 8}px` }}
                />
              ))}
            </div>
            
            {/* Pot handles */}
            <div className="absolute -left-2 top-2 w-4 h-2 border-2 border-gray-600 rounded-full"></div>
            <div className="absolute -right-2 top-2 w-4 h-2 border-2 border-gray-600 rounded-full"></div>
          </div>
        </motion.div>

        {/* Ingredients floating around */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-32 h-32 -m-6"
        >
          {['🥕', '🧄', '🥬', '🍅', '🧅', '🌶️'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              className="absolute text-2xl"
              style={{
                left: `${50 + 40 * Math.cos((i * 60) * Math.PI / 180)}%`,
                top: `${50 + 40 * Math.sin((i * 60) * Math.PI / 180)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* AI thinking text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl font-semibold text-emerald-800 mb-2"
        >
          🤖 AI Chef is cooking up something delicious...
        </motion.p>
        
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="text-sm text-emerald-600"
        >
          Analyzing ingredients and creating the perfect recipe
        </motion.p>
      </motion.div>
    </div>
  );
}
