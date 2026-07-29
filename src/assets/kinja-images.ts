import { withLqip, type PictureImage } from "@/components/OptimizedImage";

import sketches1 from "@/assets/kinjanav/sketches-1.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import sketches1Lqip from "@/assets/kinjanav/sketches-1.jpg?w=64&blur=2&quality=40&format=webp&inline";
import kibbon from "@/assets/kinjanav/kibbon.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import kibbonLqip from "@/assets/kinjanav/kibbon.jpg?w=64&blur=2&quality=40&format=webp&inline";
import magiccards from "@/assets/kinjanav/magiccards.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import magiccardsLqip from "@/assets/kinjanav/magiccards.jpg?w=64&blur=2&quality=40&format=webp&inline";
import odc from "@/assets/kinjanav/odc.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import odcLqip from "@/assets/kinjanav/odc.jpg?w=64&blur=2&quality=40&format=webp&inline";
import scoring from "@/assets/kinjanav/scoring.png?w=480;720;1080&format=webp;jpg&as=picture";
import scoringLqip from "@/assets/kinjanav/scoring.png?w=64&blur=2&quality=40&format=webp&inline";
import interviews from "@/assets/kinjanav/interviews.png?w=480;720;1080&format=webp;jpg&as=picture";
import interviewsLqip from "@/assets/kinjanav/interviews.png?w=64&blur=2&quality=40&format=webp&inline";
import explore from "@/assets/kinjanav/explore.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import exploreLqip from "@/assets/kinjanav/explore.jpg?w=64&blur=2&quality=40&format=webp&inline";

import homepageAfter from "@/assets/kinjanav/homepage-after.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import homepageAfterLqip from "@/assets/kinjanav/homepage-after.jpg?w=64&blur=2&quality=40&format=webp&inline";
import homepageBefore from "@/assets/kinjanav/homepage-before.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import homepageBeforeLqip from "@/assets/kinjanav/homepage-before.jpg?w=64&blur=2&quality=40&format=webp&inline";
import articleAfter from "@/assets/kinjanav/article-after.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import articleAfterLqip from "@/assets/kinjanav/article-after.jpg?w=64&blur=2&quality=40&format=webp&inline";
import articleBefore from "@/assets/kinjanav/article-before.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import articleBeforeLqip from "@/assets/kinjanav/article-before.jpg?w=64&blur=2&quality=40&format=webp&inline";
import verticalAfter from "@/assets/kinjanav/vertical-after.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import verticalAfterLqip from "@/assets/kinjanav/vertical-after.jpg?w=64&blur=2&quality=40&format=webp&inline";
import verticalBefore from "@/assets/kinjanav/vertical-before.jpg?w=480;720;1080&format=webp;jpg&as=picture";
import verticalBeforeLqip from "@/assets/kinjanav/vertical-before.jpg?w=64&blur=2&quality=40&format=webp&inline";

import learningsVerticallogo from "@/assets/kinjanav/learnings-verticallogo.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsVerticallogoLqip from "@/assets/kinjanav/learnings-verticallogo.jpg?w=64&blur=2&quality=40&format=webp&inline";
import learningsLogo from "@/assets/kinjanav/learnings-logo.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsLogoLqip from "@/assets/kinjanav/learnings-logo.jpg?w=64&blur=2&quality=40&format=webp&inline";
import learningsTagline from "@/assets/kinjanav/learnings-tagline.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsTaglineLqip from "@/assets/kinjanav/learnings-tagline.jpg?w=64&blur=2&quality=40&format=webp&inline";
import learningsVerticalheaders from "@/assets/kinjanav/learnings-verticalheaders.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsVerticalheadersLqip from "@/assets/kinjanav/learnings-verticalheaders.jpg?w=64&blur=2&quality=40&format=webp&inline";
import learningsTabbar from "@/assets/kinjanav/learnings-tabbar.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsTabbarLqip from "@/assets/kinjanav/learnings-tabbar.jpg?w=64&blur=2&quality=40&format=webp&inline";
import learningsBespoke from "@/assets/kinjanav/learnings-bespoke.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsBespokeLqip from "@/assets/kinjanav/learnings-bespoke.jpg?w=64&blur=2&quality=40&format=webp&inline";
import learningsFamiliar from "@/assets/kinjanav/learnings-familiar.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsFamiliarLqip from "@/assets/kinjanav/learnings-familiar.jpg?w=64&blur=2&quality=40&format=webp&inline";
import learningsMagiccards from "@/assets/kinjanav/learnings-magiccards.jpg?w=280;560&format=webp;jpg&as=picture";
import learningsMagiccardsLqip from "@/assets/kinjanav/learnings-magiccards.jpg?w=64&blur=2&quality=40&format=webp&inline";

export const kinjaImages = {
  sketches1: withLqip(sketches1 as PictureImage, sketches1Lqip),
  kibbon: withLqip(kibbon as PictureImage, kibbonLqip),
  magiccards: withLqip(magiccards as PictureImage, magiccardsLqip),
  odc: withLqip(odc as PictureImage, odcLqip),
  scoring: withLqip(scoring as PictureImage, scoringLqip),
  interviews: withLqip(interviews as PictureImage, interviewsLqip),
  explore: withLqip(explore as PictureImage, exploreLqip),
  homepageAfter: withLqip(homepageAfter as PictureImage, homepageAfterLqip),
  homepageBefore: withLqip(homepageBefore as PictureImage, homepageBeforeLqip),
  articleAfter: withLqip(articleAfter as PictureImage, articleAfterLqip),
  articleBefore: withLqip(articleBefore as PictureImage, articleBeforeLqip),
  verticalAfter: withLqip(verticalAfter as PictureImage, verticalAfterLqip),
  verticalBefore: withLqip(verticalBefore as PictureImage, verticalBeforeLqip),
  learnings: {
    verticallogo: withLqip(
      learningsVerticallogo as PictureImage,
      learningsVerticallogoLqip,
    ),
    logo: withLqip(learningsLogo as PictureImage, learningsLogoLqip),
    tagline: withLqip(learningsTagline as PictureImage, learningsTaglineLqip),
    verticalheaders: withLqip(
      learningsVerticalheaders as PictureImage,
      learningsVerticalheadersLqip,
    ),
    tabbar: withLqip(learningsTabbar as PictureImage, learningsTabbarLqip),
    bespoke: withLqip(learningsBespoke as PictureImage, learningsBespokeLqip),
    familiar: withLqip(
      learningsFamiliar as PictureImage,
      learningsFamiliarLqip,
    ),
    magiccards: withLqip(
      learningsMagiccards as PictureImage,
      learningsMagiccardsLqip,
    ),
  },
} as const;
