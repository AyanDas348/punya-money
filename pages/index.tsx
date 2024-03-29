import Head from "next/head";
import clientPromise from "../lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useState } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import Select from "react-select";
import { data } from "../public/data";

type ConnectionStatus = {
  isConnected: boolean;
};

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [name, setName] = useState<any | {}>({});
  const [stories, setStories] = useState(0);
  const [posts, setPosts] = useState([""]);
  const [message, setMessage] = useState(false);
  const [month, setMonth] = useState<String | any>("Jan");
  console.log(month.value);
  const handleSubmit = async () => {
    try {
      const postLength = posts.filter((item) => item != "").length;
      const response = await fetch("/api/saveEntry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.value.name,
          email: name.value.email,
          perAmount: name.value.amount,
          stories,
          posts: postLength,
          reels: posts,
          amount: name.value.amount * (postLength + stories),
          month: `${month.value} - ${new Date().getFullYear()}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("POST request successful:", data);
        setName("");
        setPosts([""]);
        setStories(0);
        setMessage(true);
        setTimeout(() => {
          setMessage(false);
        }, 5000);
        // Handle the successful response as needed
      } else {
        console.error("POST request failed:", response.statusText);
        // Handle the error response as needed
      }
    } catch (error) {
      console.error("Error while making POST request:", error);
      // Handle the error as needed
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="container">
      <Head>
        <title>HYPE UP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div style={{ width: "min(100%, 700px)", marginBottom: "20px" }}>
          <h2 className="subtitle">Name:</h2>
          <Select
            value={name}
            options={data?.map((item) => ({
              value: item,
              label: item.name,
            }))}
            onChange={(e) => setName(e)}
          />
        </div>
        <div style={{ width: "min(100%, 700px)", marginBottom: "20px" }}>
          <h2 className="subtitle">Month of activity:</h2>
          <Select
            value={month}
            options={months.map((item) => ({
              value: item,
              label: item,
            }))}
            onChange={(e) => setMonth(e)}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <h2 className="subtitle">Number of stories posted:</h2>{" "}
          <h2>{stories}</h2>
          <CiCirclePlus
            onClick={() => setStories(stories + 1)}
            style={{ width: "30px", height: "30px" }}
          />
          <CiCircleMinus
            onClick={() => setStories(stories - 1)}
            style={{ width: "30px", height: "30px" }}
          />
        </div>
        <div
          style={{
            gap: "20px",
            display: "flex",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <h2 className="subtitle">Enter links for reels/posts: </h2>
          <h2>{posts.filter((item) => item != "").length}</h2>
          <CiCirclePlus
            onClick={() => setPosts((prev) => [...prev, ""])}
            style={{ width: "30px", height: "30px" }}
          />
          <CiCircleMinus
            onClick={() => setPosts((prev) => prev.slice(0, -1))}
            style={{ width: "30px", height: "30px" }}
          />
        </div>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {posts.map((item, index) => (
            <input
              key={index}
              value={item}
              type="text"
              onChange={(e) =>
                setPosts((prev) => {
                  const updatedPosts = [...prev];
                  updatedPosts[index] = e.target.value;
                  return updatedPosts;
                })
              }
              style={{
                width: "600px",
                height: "30px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "1px solid gray",
                paddingLeft: "10px",
                marginBottom: "10px",
              }}
            />
          ))}
        </div>
        <div
          onClick={() => handleSubmit()}
          style={{
            backgroundColor: "blue",
            color: "white",
            border: "1px solid blue",
            borderRadius: "10px",
            padding: "10px 30px", // Adjust padding as needed
            cursor: "pointer", // Show pointer cursor on hover
            width: "fit-content",
          }}
        >
          Submit
        </div>
        <div style={{ visibility: `${message ? "visible" : "hidden"}` }}>
          Submitted
        </div>
      </main>
    </div>
  );
}
