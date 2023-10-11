import { useRouter } from 'next/router';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Page() {
    const router = useRouter();
    const id = router.query.chapterid;
    const [data, setData] = useState(null);
    console.log(id);

    useEffect(() => {
        const fetchData = async () => {
            const options = {
                method: 'GET',
                url: `https://bhagavad-gita3.p.rapidapi.com/v2/chapters/1/`,
                headers: {
                    'X-RapidAPI-Key': '5725d40cfemsh0ca35a3e8abe856p1b3effjsn2e6a501084c9',
                    'X-RapidAPI-Host': 'bhagavad-gita3.p.rapidapi.com',
                },
            };

            try {
                const response = await axios.request(options);
                console.log(response.data)
                setData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []); // Run the effect once when the component mounts

    return (
        <div>
            {data ? (
                <div>
                    <h1>Post: {router.query.chapterid}</h1>
                    {/* Render data from the API */}
                    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                    <ChapterInfo data={data} />
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
}

function ChapterInfo({ data }) {
    return (
        <div>
            <h2>{data.name}</h2>
            <p>ID: {data.id}</p>
            <p>Name Meaning: {data.name_meaning}</p>
            <p>Name Translated: {data.name_translated}</p>
            <p>Name Transliterated: {data.name_transliterated}</p>
            <p>Slug: {data.slug}</p>
            <p>Chapter Number: {data.chapter_number}</p>
            <p>Verses Count: {data.verses_count}</p>
            <p>Chapter Summary: {data.chapter_summary}</p>
            <p>Chapter Summary (Hindi): {data.chapter_summary_hindi}</p>
        </div>
    );
}

