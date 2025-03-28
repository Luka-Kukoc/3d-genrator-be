export type Dimensions = { width?: number; height?: number };

export type Segmentation = {
  client: any;
  handle_file: any;
  rgbImageUrl: string;
  dimensions: Dimensions;
};

export type SegmentationOutput = {
  segmentedPath: string;
  segmentedUrl: string;
};

export type GenerationOutput = {
  url: string;
  path: string;
};

export type Generation = Segmentation & {
  segmentedUrl: string;
};
