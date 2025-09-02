export default function InfiniteScroll(setScrollDiv, scrollDiv, setPage) {
  setTimeout(() => {
    setScrollDiv(document.getElementById('childDiv'));
  }, 100);

  scrollDiv?.addEventListener('scroll', (event) => {
    event.preventDefault();

    if (typeof window !== 'undefined') {
      const scrollHeight = scrollDiv.scrollHeight;
      const totalHeight = scrollDiv.scrollTop + scrollDiv.clientHeight;

      if (totalHeight >= scrollHeight) {
        setPage((cur) => cur + 5);
      }
    }
  });
}
