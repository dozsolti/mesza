import { useState } from 'react';

import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import HabitCard from '@/components/habit/habit-card';
import { BlurFade } from '@/components/ui/blur-fade';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextAnimate } from '@/components/ui/text-animate';
import { WordRotate } from '@/components/ui/word-rotate';
import {
  Habit,
  HABIT_COLORS,
  HabitIcon,
} from '@/habit.types';
import { useHabitStore } from '@/stores/use-habit-store';
import { useUserStore } from '@/stores/use-user-store';

export default function SignUpPage() {
  const navigate = useNavigate();

  const { setUser } = useUserStore();
  const { addHabit } = useHabitStore();

  const [name, setName] = useState("");
  const [habitName, setHabitName] = useState<string>("");
  const habitPreview: Habit = {
    color: HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)],
    id: uuidv4(),
    logs: [],
    type: {
      value: "daily",
      config: undefined,
    },
    icon: icons[
      icons.findIndex((icon) =>
        icon.tags.some((tag) => levenshteinDistance(tag, habitName) < 3)
      ) != -1
        ? icons.findIndex((icon) =>
            icon.tags.some((tag) => levenshteinDistance(tag, habitName) < 3)
          )
        : Math.floor(Math.random() * icons.length)
    ].name,
    name: habitName,
    description: "This is a sample habit.",
  };

  const [slide, setSlide] = useState(0);

  const handleSignUp = (name: string) => {
    setUser({ name: name });
  };

  const onNext = () => {
    if (slides[slide].key === "slide-name") {
      if (name.trim().length < 2) return;
    }
    if (slide < slides.length - 1) {
      setSlide((s) => s + 1);
      return;
    }
    if (slides[slide].key === "slide-add-habits") {
      if (habitName.trim().length < 2) return;
    }

    onFinish();
  };

  const onFinish = () => {
    handleSignUp(name);
    addHabit(habitPreview);
    navigate("/");
  };

  const slides = [
    {
      key: "slide-title",
      component: <SlideTitle />,
    },
    {
      key: "slide-name",
      component: <SlideName name={name} setName={setName} />,
    },
    {
      key: "slide-add-habits",
      component: (
        <SlideAddHabits
          habitName={habitName}
          setHabitName={setHabitName}
          habitPreview={habitPreview}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center mx-auto p-4 py-30 w-md max-w-11/12 min-h-svh">
      <motion.div
        key={slides[slide].key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-3 justify-center items-center w-full"
      >
        {slides[slide].component || null}
      </motion.div>

      <div className="flex flex-1 justify-center items-center w-full">
        <BlurFade delay={3} inView>
          <Button onClick={onNext} className="w-32">
            {slide < slides.length - 1 ? "Next" : "Start"}
          </Button>
        </BlurFade>
      </div>
    </div>
  );
}

function SlideTitle() {
  return (
    <div className="flex flex-col items-center">
      <TextAnimate
        animation="blurInUp"
        by="character"
        duration={1.5}
        once
        className="font-thin text-6xl"
      >
        Mesza
      </TextAnimate>

      <BlurFade delay={1.7} inView>
        <div className="flex items-center gap-2 font-medium text-lg">
          Track your
          <span className="inline-block italic">
            <WordRotate
              words={["Habits", "Goals", "Progress", "Success"]}
              className="text-primary"
              duration={1700}
            />
          </span>
        </div>
      </BlurFade>
    </div>
  );
}

function SlideName({
  name,
  setName,
}: {
  name: string;
  setName: (name: string) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-16 font-thin text-3xl">What's your name?</h1>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

function levenshteinDistance(s: string, t: string) {
  s = s.toLowerCase();
  t = t.toLowerCase();
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  const arr = [];
  for (let i = 0; i <= t.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= s.length; j++) {
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
            );
    }
  }
  return arr[t.length][s.length];
}
const icons: { name: HabitIcon; tags: string[] }[] = [
  { name: "Star", tags: ["Star"] },
  { name: "Heart", tags: ["Heart"] },
  { name: "Sun", tags: ["Sun"] },
  { name: "Moon", tags: ["Moon"] },
  { name: "Bolt", tags: ["Bolt"] },
  { name: "Smile", tags: ["Smile"] },
  { name: "Dumbbell", tags: ["Dumbbell", "Fitness", "gym", "exercise"] },
  { name: "Book", tags: ["Book", "Read", "reading", "olvas"] },
  { name: "Music", tags: ["Music"] },
];

function SlideAddHabits({
  habitName,
  setHabitName,
  habitPreview,
}: {
  habitName: string;
  setHabitName: (name: string) => void;
  habitPreview: Habit;
}) {
  return (
    <div className="flex flex-col">
      <h1 className="mb-16 font-thin text-3xl text-center">
        What will be your first habit?
      </h1>
      {habitName && (
        <div className="mb-4 pointer-events-none">
          <HabitCard habit={habitPreview} onMore={() => {}} onLog={() => {}} />
        </div>
      )}
      <Input
        placeholder="Exercise, Read, Meditate..."
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
      />
    </div>
  );
}
