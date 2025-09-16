import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUser";
import { useState } from "react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const { setUser } = useUserStore();

  const handleSignUp = () => {
    if (name.trim()) {
      setUser({ name: name.trim() });
    }
    
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 mx-auto p-4 w-md max-w-11/12 min-h-screen">
      <h1 className="mb-20 font-thin text-3xl">What's your name?</h1>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button className="w-4/12" onClick={handleSignUp}>
        Sign up
      </Button>
    </div>
  );
}
