import React, { useEffect } from "react";
import Head from "next/head";

import { Button, FloatingLabel, Form } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import { userState } from "../../../../recoil/atoms/userAtom";
import useInput from "../../../../hooks/useInput";
import AxiosManager from "../../../../util/axiosManager";
import Layout from "../../../../components/common/layout";
import Header from "../../../../components/common/header";
import Footer from "../../../../components/common/footer";
import { GetServerSideProps } from "next";
import { CampaignType } from "../../../../recoil/atoms/campaign";

interface Props {
  campaign: NewCampaignType;
}

interface CampaignFileType {
  campaign_seq: number;
  extension: string;
  file_seq: number;
  filekey: string;
  first_register_date: Date;
  first_register_id: number;
  last_register_date: Date;
  last_register_id: number;
  name: string;
  path: string;
}

export interface NewCampaignType {
  campaign_seq: number;
  advertiser: number;
  is_premium: number;
  title: string;
  category: string;
  product: string;
  channel: string;
  area: string;
  keyword: string;
  headcount: number;
  siteURL: string;
  misson: string;
  reward: string;
  original_price: number;
  discount_price: number;
  accrual_point: number;
  campaign_guide: string;
  recruit_start_date: string;
  recruit_end_date: string;
  reviewer_announcement_date: string;
  review_start_date: string;
  review_end_date: string;
  campaign_end_date: string;
  agreement_portrait: number;
  agreement_provide_info: number;
  user_seq: number;
  campaign_file: CampaignFileType[];
  address: string;
}
const CampaignNew: React.FC<Props> = ({ campaign }) => {
  const user = useRecoilValue(userState);
  const router = useRouter();
  const { input, handleChange } = useInput<NewCampaignType>({
    ...campaign,
    user_seq: user?.user_seq || 0,
  });
  const imageInput = useInput<{ thumb: any; detail: any }>({
    thumb: {
      seq: null,
      file: null,
      url: null,
    },
    detail: {
      seq: null,
      file: null,
      url: null,
    },
  });

  useEffect(() => {
    let thumbFile: any;
    let detailFile: any;

    input.campaign_file.forEach((f) => {
      if (/thumbnail/g.test(f.name)) {
        thumbFile = f;
      } else {
        detailFile = f;
      }
    });

    if (!thumbFile || !detailFile) return;

    imageInput.setInput({
      thumb: {
        seq: thumbFile.file_seq,
        file: null,
        url: thumbFile.path || "",
      },
      detail: {
        seq: detailFile.file_seq,
        file: null,
        url: detailFile?.path || "",
      },
    });
  }, []);

  // 업데이트
  const handleCreate = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const result = await AxiosManager.patch("/campaigns", {
      campaign_seq: input.campaign_seq,
      advertiser: input.advertiser,
      is_premium: input.is_premium,
      title: input.title,
      category: input.category,
      product: input.product,
      channel: input.channel,
      area: input.area,
      keyword: input.keyword,
      headcount: input.headcount,
      siteURL: input.siteURL,
      misson: input.misson,
      reward: input.reward,
      original_price: input.original_price,
      discount_price: input.discount_price,
      accrual_point: input.accrual_point,
      campaign_guide: input.campaign_guide,
      recruit_start_date: input.recruit_start_date,
      recruit_end_date: input.recruit_end_date,
      reviewer_announcement_date: input.reviewer_announcement_date,
      review_start_date: input.review_start_date,
      review_end_date: input.review_end_date,
      campaign_end_date: input.campaign_end_date,
      agreement_portrait: input.agreement_portrait,
      agreement_provide_info: input.agreement_provide_info,
      user_seq: input.user_seq,
      address: input.address,
    });

    if (result.status === 200) {
      // 이미지를 둘다 선택하지 않았다면, 아얘실행하지 않고 끝냄
      if (
        imageInput.input.thumb.file == null &&
        imageInput.input.detail.file == null
      ) {
        alert("성공적으로 수정 되었습니다");
        router.push("/admin");
        return;
      }

      let thumbResult;
      let detailResult;
      // 썸네일과 상세페이지 둘중 하나만 할경우도 있기때문에, null이 아닌 값들만 API요청
      if (imageInput.input.thumb.file !== null) {
        const formData = new FormData();
        formData.append("campaign_img_thumbnail", imageInput.input.thumb.file);
        formData.append("campaign_seq", input.campaign_seq.toString());
        formData.append("user_seq", input.user_seq.toString());
        formData.append("file_seq", imageInput.input.thumb.seq);

        thumbResult = await AxiosManager.patch(
          "/campaigns/image/thumbnail",
          formData
        );
      }

      if (imageInput.input.detail.file !== null) {
        const formData = new FormData();
        formData.append("campaign_img_detail", imageInput.input.detail.file);
        formData.append("campaign_seq", input.campaign_seq.toString());
        formData.append("user_seq", input.user_seq.toString());
        formData.append("file_seq", imageInput.input.detail.seq);

        detailResult = await AxiosManager.patch(
          "/campaigns/image/detail",
          formData
        );
      }

      if (thumbResult?.status !== 200 || detailResult?.status !== 200) {
        alert("성공적으로 수정 되었습니다");
        router.push("/admin");
      } else {
        alert("수정 실패");
      }
    }
  };

  const handleSelectImage = (e: any, type: "thumb" | "detail") => {
    const f = e.target?.files![0];
    const objURL = URL.createObjectURL(f);
    imageInput.handleChange(type, {
      ...imageInput.input[type],
      file: f,
      url: objURL,
    });
  };

  return (
    <>
      <Head>
        <title>라온디어스 체험단 | 캠페인 수정</title>
        <meta name="description" content="라온디어스 체험단입니다" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout className="tw-mb-10">
          <Form className={"tw-mt-10"}>
            <Form.Group className="mb-3">
              <Form.Label>캠페인 제목</Form.Label>
              <Form.Control
                type="text"
                value={input.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </Form.Group>
            <div className={"md:tw-flex tw-gap-2 "}>
              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>카테고리</Form.Label>
                <Form.Select
                  onChange={(e) => handleChange("category", e.target.value)}
                  value={input.category}
                >
                  <option>카테고리</option>
                  <option value="배송형">배송형</option>
                  <option value="방문형">방문형</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>관심사</Form.Label>
                <Form.Select
                  onChange={(e) => handleChange("product", e.target.value)}
                  value={input.product}
                >
                  <option>관심사</option>
                  <option value="맛집">맛집</option>
                  <option value="여행/숙박">여행/숙박</option>
                  <option value="뷰티">뷰티</option>
                  <option value="문화/생활">문화/생활</option>
                  <option value="디지털">디지털</option>
                  <option value="패션">패션</option>
                  <option value="유아동">유아동</option>
                  <option value="도서">도서</option>
                  <option value="반려동물">반려동물</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>채널</Form.Label>
                <Form.Select
                  value={input.channel}
                  onChange={(e) => handleChange("channel", e.target.value)}
                >
                  <option>채널</option>
                  <option value="전체">전체</option>
                  <option value="블로그">블로그</option>
                  <option value="유튜브">유튜브</option>
                  <option value="인스타그램">인스타그램</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>지역</Form.Label>
                <Form.Select
                  value={input.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                >
                  <option>지역</option>
                  <option value="서울">서울</option>
                  <option value="부산">부산</option>
                  <option value="대구">대구</option>
                  <option value="광주">광주</option>
                  <option value="대전">대전</option>
                  <option value="인천">인천</option>
                  <option value="울산">울산</option>
                  <option value="제주">제주</option>
                  <option value="경기도">경기도</option>
                  <option value="충청북도">충청북도</option>
                  <option value="충청남도">충청남도</option>
                  <option value="강원도">강원도</option>
                  <option value="경상북도">경상북도</option>
                  <option value="전라북도">전라북도</option>
                  <option value="전라남도">전라남도</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>모집인원</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={"ex) 10"}
                  value={input.headcount}
                  onChange={(e) => handleChange("headcount", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3 tw-flex-1">
                <Form.Label>사이트 URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"ex) https://naver.com"}
                  value={input.siteURL}
                  onChange={(e) => handleChange("siteURL", e.target.value)}
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3 ">
              <Form.Label>상세 주소</Form.Label>
              <Form.Control
                type="text"
                placeholder={"ex) 대구 달성군 옥포읍 본리리 2379-1"}
                value={input.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>키워드</Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  "키워드는 반드시 ','(쉼표)를 이요해 구분해주세요. ex) 돌,침대,물,흙"
                }
                value={input.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
              />
            </Form.Group>

            <div className={"tw-mb-5"}>
              <Form.Label>미션</Form.Label>
              <FloatingLabel
                controlId="floatingTextarea2"
                label="미션을입력해 주세요"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  style={{ height: "100px" }}
                  value={input.misson}
                  onChange={(e) => handleChange("misson", e.target.value)}
                />
              </FloatingLabel>
            </div>
            <Form.Group className="mb-3 tw-w-[500px]">
              <Form.Label>제공내역</Form.Label>
              <Form.Control
                type="text"
                placeholder={"제공내역"}
                value={input.reward}
                onChange={(e) => handleChange("reward", e.target.value)}
              />
            </Form.Group>
            <div className="tw-flex">
              <Form.Group className="mb-3 ">
                <Form.Label>원가</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={"원가를 입력해주세요"}
                  value={input.original_price}
                  onChange={(e) =>
                    handleChange("original_price", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>할인가</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={"할인가를 입력해주세요"}
                  value={input.discount_price}
                  onChange={(e) =>
                    handleChange("discount_price", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>포인트</Form.Label>
                <Form.Control
                  type="number"
                  value={input.accrual_point}
                  onChange={(e) =>
                    handleChange("accrual_point", e.target.value)
                  }
                />
              </Form.Group>
            </div>
            <>
              <Form.Label>캠페인 안내</Form.Label>
              <FloatingLabel
                controlId="floatingTextarea2"
                label="캠페인 안내사항을 적어주세요"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  style={{ height: "100px" }}
                  value={input.campaign_guide}
                  onChange={(e) =>
                    handleChange("campaign_guide", e.target.value)
                  }
                />
              </FloatingLabel>
            </>
            <div className={"tw-flex  tw-gap-5 tw-mt-10"}>
              <div>
                <Form.Group className="mb-3">
                  <Form.Label>리뷰어 모집 기간</Form.Label>
                  <div className="tw-flex tw-justify-start tw-max-w-[500px]">
                    <Form.Control
                      type="datetime-local"
                      value={input.recruit_start_date.replace(" ", "T")}
                      onChange={(e) =>
                        handleChange("recruit_start_date", e.target.value)
                      }
                    />
                    <div className={"tw-mx-5"}>~</div>
                    <Form.Control
                      type="datetime-local"
                      value={input.recruit_end_date.replace(" ", "T")}
                      onChange={(e) =>
                        handleChange("recruit_end_date", e.target.value)
                      }
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>리뷰어 활동 기간</Form.Label>
                  <div className="tw-flex tw-justify-start tw-max-w-[500px]">
                    <Form.Control
                      type="datetime-local"
                      value={input.review_start_date.replace(" ", "T")}
                      onChange={(e) =>
                        handleChange("review_start_date", e.target.value)
                      }
                    />
                    <div className={"tw-mx-5"}>~</div>
                    <Form.Control
                      type="datetime-local"
                      value={input.review_end_date.replace(" ", "T")}
                      onChange={(e) =>
                        handleChange("review_end_date", e.target.value)
                      }
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>리뷰어 선발 발표일자</Form.Label>
                  <div className="tw-flex tw-justify-start tw-max-w-[500px]">
                    <Form.Control
                      type="datetime-local"
                      value={input.reviewer_announcement_date.replace(" ", "T")}
                      onChange={(e) =>
                        handleChange(
                          "reviewer_announcement_date",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>캠페인 종료일자</Form.Label>
                  <div className="tw-flex tw-justify-start tw-max-w-[500px]">
                    <Form.Control
                      type="datetime-local"
                      value={input.campaign_end_date.replace(" ", "T")}
                      onChange={(e) =>
                        handleChange("campaign_end_date", e.target.value)
                      }
                    />
                  </div>
                </Form.Group>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={input?.is_premium === 1}
                      onChange={(e) =>
                        handleChange("is_premium", e.target.checked ? 1 : 0)
                      }
                    />
                    <span className={`tw-text-black tw-pl-2`}>
                      프리미엄 여부
                    </span>
                  </label>
                </div>
              </div>
              <div className={"tw-flex tw-gap-2 "}>
                <Form.Group controlId="formFile" className="mb-3 tw-flex-1">
                  <Form.Label>썸네일 사진</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      handleSelectImage(e, "thumb");
                    }}
                  />
                  <div className={"!tw-h-[500px] tw-overflow-scroll "}>
                    {imageInput.input.thumb.url && (
                      <img
                        src={imageInput.input.thumb.url}
                        className={"tw-w-[100%]"}
                      />
                    )}
                  </div>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3 tw-flex-1 ">
                  <Form.Label>상세페이지 사진</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      handleSelectImage(e, "detail");
                    }}
                  />
                  <div className={"!tw-h-[500px] tw-overflow-scroll "}>
                    {imageInput.input.detail.url && (
                      <img
                        src={imageInput.input.detail.url}
                        alt="thumbnail"
                        className={"tw-w-[100%]"}
                      />
                    )}
                  </div>
                </Form.Group>
              </div>
            </div>

            <button
              className={
                "tw-mt-5 tw-bg-gray-500 tw-text-white tw-w-[100%] tw-py-3 tw-text-xl tw-font-bold tw-rounded-[6px] hover:tw-bg-primary"
              }
              onClick={(e) => {
                handleCreate(e);
              }}
            >
              적용하기
            </button>
          </Form>
        </Layout>
        <Footer />
      </>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;
  const result = await AxiosManager.get("/campaigns", {
    campaign_seq: id,
  });

  return {
    props: { campaign: result.data.campaign },
  };
};

export default CampaignNew;
