import type { PictureImage } from "@/components/OptimizedImage";

import sketches1 from "@/assets/kinjanav/sketches-1.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import kibbon from "@/assets/kinjanav/kibbon.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import magiccards from "@/assets/kinjanav/magiccards.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import odc from "@/assets/kinjanav/odc.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import scoring from "@/assets/kinjanav/scoring.png?w=480;720;1080&format=webp;jpg&as=picture";
import interviews from "@/assets/kinjanav/interviews.png?w=480;720;1080&format=webp;jpg&as=picture";
import explore from "@/assets/kinjanav/explore.jpg?w=480;720;1080&format=webp;jpg&as=picture";

import homepageAfter from "@/assets/kinjanav/homepage-after.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import homepageBefore from "@/assets/kinjanav/homepage-before.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import articleAfter from "@/assets/kinjanav/article-after.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import articleBefore from "@/assets/kinjanav/article-before.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import verticalAfter from "@/assets/kinjanav/vertical-after.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import verticalBefore from "@/assets/kinjanav/vertical-before.jpg?w=480;720;1080&format=webp;jpg&as=picture";

import learningsVerticallogo from "@/assets/kinjanav/learnings-verticallogo.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsLogo from "@/assets/kinjanav/learnings-logo.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsTagline from "@/assets/kinjanav/learnings-tagline.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsVerticalheaders from "@/assets/kinjanav/learnings-verticalheaders.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsTabbar from "@/assets/kinjanav/learnings-tabbar.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsBespoke from "@/assets/kinjanav/learnings-bespoke.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsFamiliar from "@/assets/kinjanav/learnings-familiar.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsMagiccards from "@/assets/kinjanav/learnings-magiccards.jpg?w=280;560&format=webp;jpg&as=picture";

export const kinjaImages = {
  sketches1: sketches1 as PictureImage,
  kibbon: kibbon as PictureImage,
  magiccards: magiccards as PictureImage,
  odc: odc as PictureImage,
  scoring: scoring as PictureImage,
  interviews: interviews as PictureImage,
  explore: explore as PictureImage,
  homepageAfter: homepageAfter as PictureImage,
  homepageBefore: homepageBefore as PictureImage,
  articleAfter: articleAfter as PictureImage,
  articleBefore: articleBefore as PictureImage,
  verticalAfter: verticalAfter as PictureImage,
  verticalBefore: verticalBefore as PictureImage,
  learnings: {
    verticallogo: learningsVerticallogo as PictureImage,
    logo: learningsLogo as PictureImage,
    tagline: learningsTagline as PictureImage,
    verticalheaders: learningsVerticalheaders as PictureImage,
    tabbar: learningsTabbar as PictureImage,
    bespoke: learningsBespoke as PictureImage,
    familiar: learningsFamiliar as PictureImage,
    magiccards: learningsMagiccards as PictureImage,
  },
} as const;
