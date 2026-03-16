import { useEffect, useState } from "react";

const useStorageEstimate = () => {
  const [estimate, setEstimate] = useState<StorageEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEstimate = async () => {
      if(!navigator.storage || !navigator.storage.estimate) {
        setError('StorageManager API is not supported in this browser');
        return;
      }

      try {
        const storageEstimate: StorageEstimate = await navigator.storage.estimate();
        setEstimate(storageEstimate);
      } catch (err) {
        console.error('Failed to get storage estimate:', err);
        setError('Failed to retrieve storage information.');
      }
    }

    getEstimate()
  },[])

  return { estimate, error }
}

export { useStorageEstimate }