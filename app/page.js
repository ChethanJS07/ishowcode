"use client";

import React, { useState, useEffect, useRef } from "react";
import { Avatar } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  Heart,
  MessageSquare,
  Share2,
  DollarSign,
  X,
  Video,
  VideoOff,
} from "lucide-react";
import { Gen_suggestions } from "./genai";

const superChatTiers = [
  { amount: 5, color: "bg-blue-500", duration: 2 },
  { amount: 10, color: "bg-green-500", duration: 4 },
  { amount: 20, color: "bg-yellow-500", duration: 6 },
  { amount: 50, color: "bg-red-500", duration: 8 },
  { amount: 100, color: "bg-purple-500", duration: 10 },
];
 
const profanityList = ["badword1", "badword2", "badword3"]; // Add more profanity words as needed

export default function Component() {
  const [messages, setMessages] = useState([
    { id: 1, user: "User1", text: "Hello everyone!" },
    { id: 2, user: "User2", text: "Great stream!" },
    { id: 3, user: "User3", text: "How are you doing today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isSuperChatOpen, setIsSuperChatOpen] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState(5);
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentSuperChat, setCurrentSuperChat] = useState(null);
  const [superChatTimer, setSuperChatTimer] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const scrollArea = document.querySelector(".scroll-area");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraOn]);

  useEffect(() => {
    let interval;
    if (currentSuperChat) {
      const duration =
        superChatTiers.find((tier) => tier.amount === currentSuperChat.amount)
          ?.duration || 2;
      setSuperChatTimer(duration);
      interval = setInterval(() => {
        setSuperChatTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(interval);
            setCurrentSuperChat(null);
            return 0;
          }
          return prevTimer - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [currentSuperChat]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing the camera: ", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleSendMessage = async (e, isSuper = false) => {
    e.preventDefault();
  
    if (newMessage.trim()) {
      try {
        // Call the Gen_suggestions function to sanitize the text
        const sanitizedText = await Gen_suggestions(newMessage);
  
        // Create the new message with the sanitized text
        const newMsg = {
          id: messages.length + 1,
          user: "You",
          text: sanitizedText,  // Use the sanitized text here
          isSuper,
          amount: isSuper ? superChatAmount : undefined,
        };
  
        // Update the messages state with the new message
        setMessages([...messages, newMsg]);
  
        // If it's a SuperChat, handle additional logic
        if (isSuper) {
          setIsSuperChatOpen(false);
          setCurrentSuperChat(newMsg);
          speakOrQuackMessage(newMsg.text); // Speak the sanitized message
        }
  
        // Clear the input field
        setNewMessage("");
      } catch (error) {
        console.error('Error processing message:', error);
        // Handle any errors during text sanitization
      }
    }
  };

  const speakOrQuackMessage = (message) => {
    const words = message.split(" ");
    const profanityCount = words.filter((word) =>
      profanityList.includes(word.toLowerCase())
    ).length;

    if (profanityCount > 0) {
      playQuack(profanityCount);
    } else {
      const speech = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(speech);
    }
  };

  const drawSuperChatOnCanvas = () => {
    if (canvasRef.current && currentSuperChat) {
      const ctx = canvasRef.current.getContext("2d");
      const { width, height } = canvasRef.current;
      ctx.clearRect(0, 0, width, height);

      if (superChatTimer > 0) {
        // Draw background
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, height - 80, width, 80);

        // Draw text
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(
          `${currentSuperChat.user}: ${currentSuperChat.text}`,
          10,
          height - 40
        );

        // Draw timer bar
        const timerWidth =
          (superChatTimer /
            superChatTiers.find(
              (tier) => tier.amount === currentSuperChat.amount
            ).duration) *
          width;
        ctx.fillStyle = superChatTiers.find(
          (tier) => tier.amount === currentSuperChat.amount
        ).color;
        ctx.fillRect(0, height - 5, timerWidth, 5);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(drawSuperChatOnCanvas, 100);
    return () => clearInterval(interval);
  }, [currentSuperChat, superChatTimer]);

  return (
    <div className="flex h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Video Player Section */}
      <div className="flex-grow p-6">
        <div className="relative pb-[56.25%] bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute top-0 left-0 object-cover w-full h-full"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <p className="text-2xl">Camera is off</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-4">
            <Avatar>
              <img
                src="/placeholder-avatar.jpg"
                alt="Streamer"
                className="w-12 h-12 rounded-full"
              />
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">Streamer Name</h2>
              <p className="text-sm text-gray-400">Live Camera Feed</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              size="icon"
              className={`transition-colors duration-200 ${
                isLiked ? "bg-pink-500 text-white" : ""
              }`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`transition-colors duration-200 ${
                isShared ? "bg-green-500 text-white" : ""
              }`}
              onClick={() => setIsShared(!isShared)}
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`transition-colors duration-200 ${
                isCameraOn ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => setIsCameraOn(!isCameraOn)}
            >
              {isCameraOn ? (
                <Video className="w-5 h-5" />
              ) : (
                <VideoOff className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col p-6 bg-gray-800 shadow-xl w-96 rounded-l-3xl">
        <h3 className="mb-6 text-2xl font-bold">Live Chat</h3>
        <ScrollArea className="flex-grow mb-6 scroll-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 p-3 rounded-lg ${
                msg.isSuper
                  ? `${
                      superChatTiers.find((tier) => tier.amount === msg.amount)
                        ?.color
                    } text-white`
                  : "bg-gray-700"
              } transition-all duration-300 ease-in-out hover:scale-102`}
            >
              <span className="font-bold">{msg.user}: </span>
              <span>{msg.text}</span>
              {msg.isSuper && (
                <div className="p-1 mt-2 text-xs bg-white rounded bg-opacity-20">
                  Super Chat: ${msg.amount}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={(e) => handleSendMessage(e)} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Send a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow transition-colors duration-200 bg-gray-700 border-gray-600 focus:border-blue-500"
          />
          <Button
            type="submit"
            className="transition-colors duration-200 bg-blue-500 hover:bg-blue-600"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Chat
          </Button>
        </form>
        <Button
          className="mt-4 transition-all duration-200 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
          onClick={() => setIsSuperChatOpen(true)}
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Super Chat
        </Button>

        {isSuperChatOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative p-6 bg-gray-800 rounded-lg shadow-2xl w-96">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setIsSuperChatOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
              <h3 className="mb-4 text-2xl font-bold">Send a Super Chat</h3>
              <p className="mb-6 text-gray-400">
                Support the streamer and highlight your message!
              </p>
              <div className="mb-6">
                <label htmlFor="amount" className="block mb-2 font-medium">
                  Amount:
                </label>
                <select
                  id="amount"
                  value={superChatAmount}
                  onChange={(e) => setSuperChatAmount(Number(e.target.value))}
                  className="w-full p-2 transition-all duration-200 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {superChatTiers.map((tier) => (
                    <option key={tier.amount} value={tier.amount}>
                      ${tier.amount} - {tier.duration}s
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block mb-2 font-medium">
                  Message:
                </label>
                <Input
                  id="message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full transition-colors duration-200 bg-gray-700 border-gray-600 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => setIsSuperChatOpen(false)}
                  variant="outline"
                  className="transition-colors duration-200 border-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={(e) => handleSendMessage(e, true)}
                  className="transition-all duration-200 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                >
                  Send Super Chat
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <audio ref={audioRef} src="/duck-quack.mp3" />
    </div>
  );
}
