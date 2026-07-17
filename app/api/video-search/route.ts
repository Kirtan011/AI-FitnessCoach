import { NextResponse } from 'next/server';
import ytSearch from 'yt-search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const results = await ytSearch(query + " exercise form tutorial");
    
    if (results && results.videos.length > 0) {
      const topVideo = results.videos[0];
      return NextResponse.json({ 
        videoId: topVideo.videoId,
        title: topVideo.title,
        url: topVideo.url 
      });
    }

    return NextResponse.json({ error: 'No videos found' }, { status: 404 });
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json({ error: 'Failed to search YouTube' }, { status: 500 });
  }
}
