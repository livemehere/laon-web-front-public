import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import CardBox from "./CardBox";
import SelectBox from "./SelectBox";
import Layout from "./layout";
import useInput from "../../hooks/useInput";
import AxiosManager from "../../util/axiosManager";
import { useRecoilState } from "recoil";
import { filterdCampaignListState } from "../../recoil/atoms/filterdCampaign";
import dayjs from "dayjs";
import { favorCampaignListState } from "../../recoil/atoms/favorCampaign";
import { CampaignType } from "../../recoil/atoms/campaign";
import { endCampaignListState } from "../../recoil/atoms/endCampaign";
import { useRouter } from "next/router";

interface CardListProps {
  col?: number;
  isFilter: boolean;
  data: CampaignType[];
}

const CardList: React.FC<CardListProps> = ({
  children,
  data,
  col,
  isFilter,
}) => {
  const { input, handleChange } = useInput<{ filter: string }>({
    filter: "최신순",
  });
  const [sortedFCamp, setSortedFCamp] = useState(data);
  const [page, setPage] = useState(1);
  const [favorCamp, setFavorCamp] = useRecoilState(favorCampaignListState);
  const [endCamp, setEndCamp] = useRecoilState(endCampaignListState);
  const [favorList, setFavorList] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    let finalSortedCamp = [...data];
    if (input.filter === "최신순") {
      finalSortedCamp.sort((a, b) =>
        dayjs(a.recruit_start_date).diff(b.recruit_start_date)
      );
    } else if (input.filter === "인기순") {
      finalSortedCamp.sort((a, b) => b.applicant_count - a.applicant_count);
    } else {
      //   선정 마감순
      finalSortedCamp.sort((a, b) =>
        dayjs(a.recruit_end_date).diff(b.recruit_end_date)
      );
    }

    setSortedFCamp(finalSortedCamp);
  }, [input.filter]);

  useEffect(() => {
    setSortedFCamp(data);
  }, [data]);

  // 찜한 캠페인들 시퀀스 만들기
  useEffect(() => {
    const favorCampSeqList = favorCamp.map((f) => f.campaign_seq);
    setFavorList(favorCampSeqList);
  }, [favorCamp]);

  const handleLoadMoreCampaign = () => {
    const maxPage = Math.ceil(sortedFCamp.length / 16);
    setPage((prev) => {
      return prev + 1 >= maxPage ? maxPage : prev + 1;
    });
  };

  return (
    <Layout className="tw-mb-10">
      <>
        {isFilter ? (
          <Row className="tw-mb-5">
            <Col>
              <div className="tw-flex tw-justify-end ">
                <div>
                  <SelectBox
                    input={input}
                    handleChange={handleChange}
                    options={["최신순", "인기순", "선정마감순"]}
                  />
                </div>
              </div>
            </Col>
          </Row>
        ) : null}
        <Row>
          <div
            className={`tw-grid ${
              col === 4 ? " xl:tw-grid-cols-4" : " xl:tw-grid-cols-3"
            } sm:tw-grid-cols-2 tw-gap-3 tw-gap-y-10`}
          >
            {sortedFCamp && (
              <>
                {router.pathname === "/"
                  ? [...sortedFCamp, ...endCamp]
                      .slice(0, page * 16)
                      .map((c) => (
                        <CardBox
                          key={c.campaign_seq}
                          campaign={c}
                          initialLiked={false} //내가 좋아요 한 캠페인 목록을 나중에 recoil로 가지고있고, 그것들을 넣어서 ,seq 포함되있는지로 하면 될듯
                          favorList={favorList}
                        />
                      ))
                  : [...sortedFCamp].slice(0, page * 16).map((c) => (
                      <CardBox
                        key={c.campaign_seq}
                        campaign={c}
                        initialLiked={false} //내가 좋아요 한 캠페인 목록을 나중에 recoil로 가지고있고, 그것들을 넣어서 ,seq 포함되있는지로 하면 될듯
                        favorList={favorList}
                      />
                    ))}
              </>
            )}
          </div>
          <div
            className={"!tw-mt-6 tw-flex tw-justify-center"}
            onClick={handleLoadMoreCampaign}
          >
            <span className="tw-cursor-pointer tw-py-2 tw-ml-0 tw-leading-tight tw-text-gray-500 tw-bg-white tw-rounded-lg tw-border tw-border-gray-300 tw-hover:bg-gray-100 hover:tw-text-gray-700 tw-w-[100%] tw-text-center">
              캠페인 더불러오기
            </span>
          </div>
        </Row>
      </>
    </Layout>
  );
};

CardList.defaultProps = {
  col: 4,
};

export default CardList;
