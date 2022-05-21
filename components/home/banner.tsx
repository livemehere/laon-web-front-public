import Image from "next/image";
import React, { useEffect, useState } from "react";
import AxiosManager from "../../util/axiosManager";

interface BannerProps {}

const Banner: React.FC<BannerProps> = ({ children }) => {
  const [bannerURL, setBannerURL] = useState();
  const getBanner = async () => {
    const r = await AxiosManager.get("/commonfile/banner");
    const latestBannerURL = r.data.data[r.data.data.length - 1].path;
    setBannerURL(latestBannerURL);
  };

  useEffect(() => {
    getBanner();
  }, []);
  return (
    <div className="tw-w-[100%] tw-relative">
      <img
        src={bannerURL || "/images/banner.png"}
        alt="banner"
        className="tw-object-cover tw-w-[100%]"
      />
    </div>
  );
};

export default Banner;
