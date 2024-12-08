"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2 } from "lucide-react"

type MysteryLevel = "none" | "some" | "alot"

export default function Randomizer() {
  const [items, setItems] = useState<string[]>([])
  const [newItem, setNewItem] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [cyclingItems, setCyclingItems] = useState<string[]>([])
  const [mysteryLevel, setMysteryLevel] = useState<MysteryLevel>("none")

  const addItem = () => {
    if (newItem.trim() !== "") {
      setItems([...items, newItem.trim()])
      setNewItem("")
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const getMysteryDuration = (level: MysteryLevel): number => {
    switch (level) {
      case "some": return 10000 // 10 seconds
      case "alot": return 70000 // 70 seconds
      default: return 3000 // 3 seconds
    }
  }

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const startSelection = () => {
    if (items.length > 0) {
      setIsSelecting(true)
      setResult(null)
      const duration = getMysteryDuration(mysteryLevel)
      const interval = 50 // Change item every 50ms
      const startTime = Date.now()

      const animate = () => {
        const elapsedTime = Date.now() - startTime
        if (elapsedTime < duration) {
          setCyclingItems(shuffleArray([...items]))
          setTimeout(animate, interval)
        } else {
          const finalResult = items[Math.floor(Math.random() * items.length)]
          setResult(finalResult)
          setCyclingItems([finalResult])
          setIsSelecting(false)
          triggerConfetti()
        }
      }

      animate()
    }
  }

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center text-slate-600">Randomizer 🎲</h1>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Add an item ✨"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addItem()}
              className="rounded-md border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
            <Button onClick={addItem} className="rounded-md bg-slate-500 text-white hover:bg-slate-600">
              Add 📝
            </Button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex justify-between items-center bg-blue-50 p-2 rounded-md"
              >
                <span className="ml-2 text-blue-800">{item}</span>
                <Button variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-blue-400 hover:text-blue-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
          <RadioGroup
            value={mysteryLevel}
            onValueChange={(value) => setMysteryLevel(value as MysteryLevel)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">No mystery (result in 3 seconds) ⚡</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="some" id="some" />
              <Label htmlFor="some">Some mystery (result in 10 seconds) 🕐</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="alot" id="alot" />
              <Label htmlFor="alot">A lot of mystery (result in 70 seconds) 🕰️</Label>
            </div>
          </RadioGroup>
          <Button
            onClick={startSelection}
            disabled={items.length === 0 || isSelecting}
            className="w-full rounded-md bg-blue-500 text-white hover:bg-blue-600 font-medium py-2 text-lg transition-colors duration-200"
          >
            Randomize 🎭
          </Button>
          <AnimatePresence>
            {(isSelecting || result) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-4 bg-slate-100 rounded-md"
              >
                <h3 className="text-xl font-semibold mb-2 text-blue-800">
                  {isSelecting ? "Selecting... 🔮" : "Result 🎉"}
                </h3>
                <div className="h-12 flex items-center justify-center overflow-hidden">
                  <AnimatePresence>
                    {cyclingItems.map((item, index) => (
                      <motion.p
                        key={`${item}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl font-bold text-black absolute"
                      >
                        {item}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

