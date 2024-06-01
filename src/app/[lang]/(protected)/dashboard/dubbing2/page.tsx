"use client"
// pages/subtitles.js
import dynamic from 'next/dynamic';
import React from 'react';
import { useEffect, useState, useRef } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { BeatLoader } from 'react-spinners';
import { useRouter } from "next/navigation";
import { customFetch } from "@/lib/utils"

//TODO yeni speaker eklemeyi yapacağız
//TODO yeni subtitle eklemeyi yapacağız

const VideoPlayer = dynamic(() => import('../../../../../components/VideoPlayer'), { ssr: false });

interface Subtitle {
  index: string;
  time: string;
  content: string;
  speaker?: string;
}

interface LanguageDetail {
  name: string;
  flagCode: string;
}

const languageDetails: Record<'original' | 'translated', LanguageDetail> = {
  original: { name: 'Turkish', flagCode: 'tr' },
  translated: { name: 'English (US)', flagCode: 'us' }
};

const flagUrl = (code: string) => `https://flagcdn.com/16x12/${code}.png`;

const fetchWithRetry = async (url : any, options : any, interval = 5000) => {
  while (true) {
    try {
      const response = await customFetch(url, options);
      if (!response.ok) throw new Error('Server response was not OK');
      return response.json();
    } catch (error) {
      console.error(error);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
};

const parseSpeakersFromSRT = (srtData : any) => {
  const speakersSet = new Set();
  const blocks = srtData.split('\n\n');

  blocks.forEach((block: string) => {
    const lines = block.split('\n');
    if (lines.length > 2) {
      const contentLine = lines[2];
      // @ts-ignore
      const match = contentLine.match(/^(Speaker \d+):/);
      if (match) {
        speakersSet.add(match[1]);
      }
    }
  });

  return Array.from(speakersSet);
};

const parseSRT = (srt: string): Subtitle[] | null[] => {
  // @ts-ignore
  return srt.split('\n\n').filter(Boolean).map(block => {

    const lines = block.split('\n');
    if (lines.length < 3) return null;

    const [index, time, ...contentLines] = lines;
    const content = contentLines.join(' ');
    const speakerMatch = content.match(/^(Speaker \d+): (.+)/);

    if (!index || !time || !speakerMatch) return null;
    return {
      index: index.trim(),
      time: time.trim(),
      speaker: speakerMatch[1],
      content: speakerMatch[2],
    };
  }).filter(Boolean);
};

const timeToSeconds = (time: string) => {
  const [hours, minutes, seconds] = time.split(':');
  // @ts-ignore
  return Number(hours) * 3600 + Number(minutes) * 60 + parseFloat(seconds.replace(',', '.'));
};


export default function SubtitlesPage() {
  let videoId: string | null;
  if (typeof window !== 'undefined') {
    videoId = window.localStorage.getItem('dubbingId');
  }
  //videoId = 'b01814d5-88a6-465b-94f4-62f20c449055';
  const token = '123213';
  const [videoData, setVideoData] = useState({
    videoUrl: '',
    videoSrtUrl: '',
    translatedSrtUrl: ''
  });
  const [videoSubtitles, setVideoSubtitles] = useState<Subtitle[]>([]);
  const [translatedSubtitles, setTranslatedSubtitles] = useState<Subtitle[]>([]);
  const [editMode, setEditMode] = useState<{ index: string; field: 'speaker' | 'content'; language: 'original' | 'translated' } | null>(null);
  const [speakers, setSpeakers] = useState([]);
  const [addingNewSpeaker, setAddingNewSpeaker] = useState(false);
  const videoPlayerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchWithRetry(`http://0.0.0.0:8000/video-resources/${videoId}?token=${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setVideoData({
          videoUrl: data.video_url,
          videoSrtUrl: data.video_srt,
          translatedSrtUrl: data.translated_video_srt
        });
      } catch (error) {
        console.error('Failed to fetch video data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (videoData.translatedSrtUrl) {
      fetch(videoData.translatedSrtUrl)
        .then(response => response.text())
        .then(data => {
          // @ts-ignore
          setSpeakers(parseSpeakersFromSRT(data));
          // @ts-ignore
          setTranslatedSubtitles(parseSRT(data));
        })
        .catch(error => console.error('Error loading translated SRT file:', error));
    }

    if (videoData.videoSrtUrl) {
      fetch(videoData.videoSrtUrl)
        .then(response => response.text())
        .then(data => {
          // @ts-ignore
          setVideoSubtitles(parseSRT(data));
        })
        .catch(error => console.error('Error loading video SRT file:', error));
    }
  }, [videoData]);

  const toggleEditMode = (index: string, field: 'speaker' | 'content', language: 'original' | 'translated') => {
    if (field === 'speaker' && addingNewSpeaker) {
      setAddingNewSpeaker(false); // Disable new speaker input if switching fields
    }
    setEditMode(current => current && current.index === index && current.field === field && current.language === language ? null : { index, field, language });
  };

  const handleSubtitleChange = (index : any, field : any, value : any, language : any) => {
    const updateSubtitles = (subs : any) => subs.map((sub: { index: any; }) => sub.index === index ? { ...sub, [field]: value } : sub);

    if (field === 'speaker') {
      //console.log('Updating speaker:', value);
      // Update speaker name in both original and translated subtitles
      setVideoSubtitles(prev => updateSubtitles(prev));
      setTranslatedSubtitles(prev => updateSubtitles(prev));
    } else {
      // Update content only in the targeted subtitles
      const setter = language === 'original' ? setVideoSubtitles : setTranslatedSubtitles;
      setter(prev => updateSubtitles(prev));
    }
  };
  const handleSubtitleClick = (timeString : any) => {
    const timeParts = timeString.split(' --> ');
    const startTime = timeToSeconds(timeParts[0]);
    //console.log('Seeking to:', startTime);
    //console.log('Ref:', videoPlayerRef.current);
    if (videoPlayerRef.current) {
      //console.log('Seeking to2:', startTime);
      // @ts-ignore
      videoPlayerRef.current.seekTo(startTime, 'seconds');
    }
  };

  const combinedSubtitles = videoSubtitles.map(sub => ({
    original: sub,
    translated: translatedSubtitles.find(transSub => transSub.index === sub.index) || null
  }));


  const handleSaveChanges = async () => {
    const exportSRT = (subtitles : any) => {
      let srtContent = subtitles.map((sub: { index: any; time: any; speaker: any; content: any; }) => `${sub.index}\n${sub.time}\n${sub.speaker ? `${sub.speaker}: ` : ''}${sub.content}\n`).join('\n\n');
      const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
      const formData = new FormData();
      formData.append('srt_file', blob, 'updated_subtitles.srt');

      customFetch(`http://0.0.0.0:8000/dubbings/updatesrt/${videoId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`  // Adjust as necessary for your auth setup
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to upload SRT file');
        }
        return response.json();
      })
      .then(data => {
        console.log('Upload successful:', data);
        alert('Dubbing Started Succesfully!');
        router.push('/dashboard/mydubbings');
      })
      .catch(error => {
        console.error('Error uploading SRT file:', error);
        alert('Failed to update SRT file.');
      });
    };

    exportSRT(translatedSubtitles);
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BeatLoader color="#123abc" loading={loading} size={5} />
        <p className="ml-2">Speakers Identifying and Translating...</p>
      </div>
    );
  }

  // @ts-ignore
  return (
    <div className="flex h-screen flex-col p-20">
      <span className="mb-3 text-3xl font-bold">Update & Confirm Translation</span>
      <span className="text-slate-600">
      You can edit the video's translation for more accuracy. Our system translated automatically but if you need to edit just double click and add your input.
      When pressed the save changes and submit button dubbing will start.
      </span>
      <VideoPlayer playerRef={videoPlayerRef} videoUrl={videoData.videoUrl} />
    <button onClick={handleSaveChanges} className="mt-4 mb-10 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">
        Save Changes and Continue Dubbing
    </button>
      <div className="flex justify-between">
        <div className="flex items-center">
          <img src={flagUrl(languageDetails.original.flagCode)} alt={`${languageDetails.original.name} flag`} className="mr-2" />
          <span>{languageDetails.original.name}</span>
        </div>
        <div className="flex items-center">
          <img src={flagUrl(languageDetails.translated.flagCode)} alt={`${languageDetails.translated.name} flag`} className="mr-2" />
          <span>{languageDetails.translated.name}</span>
        </div>
      </div>
      {combinedSubtitles.map((pair, idx) => (
        <div key={idx} className="p-2 border-b" onClick={() => handleSubtitleClick(pair.original.time)}>
          <div className="flex justify-center p-2 ">
            <div className="text-center flex items-center ">
              {editMode?.index === pair.original.index && editMode.field === 'speaker' && editMode.language === 'original' ? (
                <select
                  value={pair.original.speaker}
                  onChange={e => handleSubtitleChange(pair.original.index, 'speaker', e.target.value, 'original')}
                  onBlur={() => toggleEditMode(pair.original.index, 'speaker', 'original')}
                  className="border p-1"
                  autoFocus
                >
                  {speakers.map(speaker => (
                    <option key={speaker} value={speaker}>{speaker}</option>
                  ))}
                </select>
              ) : (
                <>
                  <strong onClick={() => toggleEditMode(pair.original.index, 'speaker', 'original')}>{pair.original.speaker || 'Select Speaker'}</strong>
                  <IoIosArrowDropdown onClick={() => toggleEditMode(pair.original.index, 'speaker', 'original')} className="ml-2 cursor-pointer" />
                </>
              )}
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-1/2 p-4">
              {editMode?.index === pair.original.index && editMode.field === 'content' && editMode.language === 'original' ? (
                <textarea
                  value={pair.original.content}
                  onChange={e => handleSubtitleChange(pair.original.index, 'content', e.target.value, 'original')}
                  onBlur={() => toggleEditMode(pair.original.index, 'content', 'original')}
                  className="border p-1 w-full"
                  autoFocus
                  rows={3} // Adjust the number of rows based on typical content length
                />
              ) : (
                <p onClick={() => toggleEditMode(pair.original.index, 'content', 'original')}>{pair.original.content}</p>
              )}
            </div>
            <div className="w-1/2 p-4">
              {pair.translated && (editMode?.index === pair.translated.index && editMode.field === 'content' && editMode.language === 'translated') ? (
                <textarea
                  value={pair.translated.content}
                  onChange={e => handleSubtitleChange(pair.translated ? pair.translated.index : "undefined", 'content', e.target.value, 'translated')}
                  onBlur={() => toggleEditMode(pair.translated ? pair.translated.index : "undefined", 'content', 'translated')}
                  className="border p-1 w-full"
                  autoFocus
                  rows={3} // Adjust the number of rows based on typical content length
                />
              ) : (
                pair.translated ? <p onClick={() => toggleEditMode(pair.translated ? pair.translated.index : "undefined", 'content', 'translated')}>{pair.translated.content}</p> : <p>No translation available.</p>
              )}
            </div>
          </div>
          <div className="flex justify-center p-2">
            <div className="text-center">
              <strong>{pair.original.time}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>

  );

}
