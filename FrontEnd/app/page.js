
export const metadata = {
  title: 'Home',
};

export default function Home({ userName }) {
  return (
    <div className="flex justify-center items-center  h-full">
      <strong className="text-4xl animate-bounce flex flex-col gap-2 justify-center items-center">
        <h1>Welcome {userName}</h1>
        <h1>Echoes of Memories</h1>




      </strong>


      

    </div>
  );
}

/*bg-gradient-to-r from-green-50 via-green-500 to-green-50*/
