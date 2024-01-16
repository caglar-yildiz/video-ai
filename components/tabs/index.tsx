"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function TextareaWithButton({handleChange}: {handleChange: any}) {
  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." onChange={handleChange}/>
      <Button onClick={handleSubmit}>Send message</Button>
    </div>
  );
}


function handleSubmit() {
  console.log("submit");
}

export default function TabsDemo() {
  const [link, setLink] = useState("");

  function handleChange(e: any) {
    setLink(e.target.value);
    console.log(link);
  }

  return (
    <Tabs defaultValue="tab1" className="w-[400px] flex justify-center">
    <div className="w-4/5">
      <TabsList>
        <TabsTrigger value="tab1" >tab1</TabsTrigger>
        <TabsTrigger value="tab2">tab2</TabsTrigger>
        <TabsTrigger value="tab3">tab2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <TextareaWithButton handleChange={handleChange}/>
      </TabsContent>
      <TabsContent value="tab2">
        <TextareaWithButton handleChange={handleChange}/>
      </TabsContent>{" "}
      <TabsContent value="tab3">
        <TextareaWithButton handleChange={handleChange}/>
      </TabsContent>
    </div>
  </Tabs>
  );
}
