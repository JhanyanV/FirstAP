import {useVideoConfig} from 'remotion';

/** Layout info shared by all scenes so one set of scenes serves both 16:9 and 9:16. */
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  return {width, height, vertical};
};
