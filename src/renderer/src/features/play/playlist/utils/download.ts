
export async function downloadMp4(props: {
  src: string,
  signal?: AbortSignal | null,
  outputFileName: string,
  onProgress?: any 
}) {
  const {src, signal, outputFileName, onProgress} = props;
  try {
    const response = await fetch(src, { signal: signal });
    const contentLength = Number(response.headers.get('Content-Length'));
    let reader = response.body?.getReader();
    let chunks = [];
    let receivedLength = 0;

    if(contentLength) {
      if(reader) {

        while(true) {
          const { done, value } = await reader.read()

          if(done) { break; }

          chunks.push(value);
          receivedLength += value.length;
          const loaded = Math.round(((receivedLength/contentLength)*100))
          if(loaded%20===0) {
            if(onProgress) {
              onProgress(loaded);
            }
          }
        }

        const blob = new Blob(chunks);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = outputFileName;
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    }
    return true;
  }
  catch (e) {
    console.error(e)
    return false;
  }
}