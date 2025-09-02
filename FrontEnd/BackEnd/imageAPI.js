export default async function GetImageAPI() {
  const images = await fetch("http://127.1.0.1:8000/v1/memories/images/images");
  const data = await images.json();

  return <h1>{data}</h1>;
}
