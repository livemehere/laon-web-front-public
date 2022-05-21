import React, { useEffect, useState } from "react";
import Banner from "./banner";
import CardList from "../common/cardList";
import Counter from "./counter";
import Footer from "../common/footer";
import Header from "../common/header";
import Notice from "./notice";
import { campaignListState, CampaignType } from "../../recoil/atoms/campaign";
import useInput from "../../hooks/useInput";
import { useRecoilState } from "recoil";
import { noticeState, NoticeType } from "../../recoil/atoms/notice";
import { filterdCampaignListState } from "../../recoil/atoms/filterdCampaign";
import AxiosManager from "../../util/axiosManager";
import { userState } from "../../recoil/atoms/userAtom";
import { favorCampaignListState } from "../../recoil/atoms/favorCampaign";
import { additionalInfoState } from "../../recoil/atoms/additionalInfo";
import dayjs from "dayjs";
import { filterIsOpenState } from "../../recoil/atoms/filterIsOpenState";
import { endCampaignListState } from "../../recoil/atoms/endCampaign";

interface HomeWrapProps {
  children?: JSX.Element;
  allCampaignList: CampaignType[];
  total: number;
  notices: NoticeType[];
}

function HomeWrap({
  children,
  allCampaignList,
  total,
  notices,
}: HomeWrapProps) {
  const { input, handleChange } = useInput({});
  const [camp, setCamp] = useRecoilState(campaignListState);
  const [fCamp, setFCamp] = useRecoilState(filterdCampaignListState);
  const [notice, setNotice] = useRecoilState(noticeState);
  const [user, setUser] = useRecoilState(userState);
  const [favorCamp, setFavorCamp] = useRecoilState(favorCampaignListState);
  const [additionalInfo, setAdditionalInfo] =
    useRecoilState(additionalInfoState);
  const [filterIsOpen, setFilterIsPoen] = useRecoilState(filterIsOpenState);
  const [endCamps, setEndCamps] = useRecoilState(endCampaignListState);

  const getFavorCamp = async (seq: number) => {
    const favorCampResult = await AxiosManager.get("/users/interest-campaign", {
      user_seq: seq,
    });
    setFavorCamp(favorCampResult.data.interestCampaign);
  };

  const getAdditionalInfo = async (seq: number) => {
    const additionalInfoResult = await AxiosManager.get("/users/additional", {
      user_seq: seq,
    });
    console.log("additionalInfoResult", additionalInfoResult);
    setAdditionalInfo(additionalInfoResult.data.additionalInfo);
  };

  useEffect(() => {
    getFavorCamp(Number(user?.user_seq));
    getAdditionalInfo(Number(user?.user_seq));
  }, [user]);

  useEffect(() => {
    const filterEndCamps: CampaignType[] = [];
    const activeCamps: CampaignType[] = [];
    [...allCampaignList].forEach((c) => {
      if (dayjs().diff(c.campaign_end_date, "d") > 0) {
        filterEndCamps.push(c);
      } else {
        activeCamps.push(c);
      }
    });
    setCamp(activeCamps);
    setFCamp(activeCamps);
    setEndCamps(filterEndCamps);
    setNotice(notices);

    const rest = total % 20;
    const moc = Math.floor(total / 20);
    let finalPage: number;

    if (moc > 0) {
      if (rest > 0) {
        finalPage = moc + 1;
      } else {
        finalPage = moc;
      }
    } else {
      finalPage = 1;
    }
  }, []);

  return (
    <>
      <Header />
      {!filterIsOpen && <Banner />}
      {!filterIsOpen && <Counter />}
      {fCamp && (
        <CardList
          data={
            user?.is_premium === 1
              ? fCamp
              : fCamp.filter((c) => c.is_premium !== 1)
          }
          isFilter={true}
        />
      )}
      <Notice notices={notices} />
      <Footer />
    </>
  );
}

export default HomeWrap;
