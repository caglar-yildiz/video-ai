"use client"
import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import ReactPlayer from 'react-player';
import { customFetch } from "@/lib/utils"

export default function MyDubbingsPage() {
  const [dubbings, setDubbings] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('1234');
  const [videoUrl, setVideoUrl] = useState(''); // State to hold the video URL

  useEffect(() => {
    const fetchDubbings = async () => {
      if (!userId) {
        setError('User ID is missing');
        setLoading(false);
        return;
      }
      setLoading(true);
      const endpoint = `http://0.0.0.0:8000/alldubbingsforuser/${userId}`;
      try {
        const response = await customFetch(endpoint);
        const data = await response.json();
        setDubbings(data.map((dub: { created_at: any; updated_at: any; }) => ({
          ...dub,
          created_at: formatDate(dub.created_at),
          updated_at: dub.updated_at ? formatDate(dub.updated_at) : 'N/A'
        })));
      } catch (error : any) {
        console.error('Failed to fetch dubbings:', error);
        setError(error.message);
      }
      setLoading(false);
    };

    fetchDubbings();
  }, [userId]);

  const formatDate = (dateString : any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleVideoClick = (url : any) => {
    setVideoUrl(url); // Set the video URL and the modal will display
  };

  const closeModal = () => {
    setVideoUrl(''); // Reset the video URL and close the modal
  };

  // @ts-ignore
  return (
    <div className="flex flex-col h-screen p-20">
      <span className="mb-3 text-3xl font-bold">My Dubbings</span>
      <span className="mb-8 text-slate-600">
        You can view and manage your dubbings here.
      </span>
      {loading ? (
        <div className="flex justify-center items-center">
          <BeatLoader color="#4A90E2" />
        </div>
      ) : error ? (
        <p className="text-red-500">Error fetching dubbings: {error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="top-0 z-10 bg-gray-100">
              <tr>
                {['Project Name', 'Input URL', 'Languages', 'Status', 'Credits Cost', 'Created At', 'Updated At', 'Dubbed Video'].map(header => (
                  <th key={header} className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="max-h-[60vh] overflow-y-auto">
              {dubbings.map((dub: { project_name: string ;input_url: string ;
                input_language: string ;
                output_language: string ;
                status: string ;
                credits_cost: string ;
                created_at: string ;
                updated_at: string ;
                video_url: string ;
              }) => (
                <tr key={dub.project_name}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {dub.project_name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <a href={dub.input_url} className="text-blue-500 hover:text-blue-800">
                      {dub.input_url}
                    </a>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {dub.input_language} ➜ {dub.output_language}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {dub.status}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {dub.credits_cost}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {dub.created_at}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {dub.updated_at}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <button onClick={() => handleVideoClick(dub.video_url)} className="text-blue-500 hover:text-blue-800">
                      &#9658; {/* This is the Unicode for a play symbol */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {videoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <ReactPlayer url={videoUrl} controls width="640px" height="360px" />
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
