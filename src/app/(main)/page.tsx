"use client";

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { open } from "@/components/accounts/newAccountSlice";

export default function Home() {
  const dispatch = useDispatch();

  return (
    <div>
      <Button onClick={() => dispatch(open())}>Open Account</Button>
    </div>
  );
}
