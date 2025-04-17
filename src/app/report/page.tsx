"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentsTab from "./components/comments-tab";
import VideosTab from "./components/videos-tab";

export default function ReportPage() {
    const [activeTab, setActiveTab] = useState("comments");

    return (
        <div className="p-6 space-y-6">
            <Tabs
                defaultValue="comments"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid max-w-[400px] grid-cols-2">
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                </TabsList>
                <TabsContent value="comments" className="mt-6">
                    <CommentsTab />
                </TabsContent>
                <TabsContent value="videos" className="mt-6">
                    <VideosTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
