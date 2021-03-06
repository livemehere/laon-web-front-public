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

  // ????????????
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
      // ???????????? ?????? ???????????? ????????????, ?????????????????? ?????? ??????
      if (
        imageInput.input.thumb.file == null &&
        imageInput.input.detail.file == null
      ) {
        alert("??????????????? ?????? ???????????????");
        router.push("/admin");
        return;
      }

      let thumbResult;
      let detailResult;
      // ???????????? ??????????????? ?????? ????????? ???????????? ???????????????, null??? ?????? ????????? API??????
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
        alert("??????????????? ?????? ???????????????");
        router.push("/admin");
      } else {
        alert("?????? ??????");
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
        <title>??????????????? ????????? | ????????? ??????</title>
        <meta name="description" content="??????????????? ??????????????????" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <Layout className="tw-mb-10">
          <Form className={"tw-mt-10"}>
            <Form.Group className="mb-3">
              <Form.Label>????????? ??????</Form.Label>
              <Form.Control
                type="text"
                value={input.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </Form.Group>
            <div className={"md:tw-flex tw-gap-2 "}>
              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>????????????</Form.Label>
                <Form.Select
                  onChange={(e) => handleChange("category", e.target.value)}
                  value={input.category}
                >
                  <option>????????????</option>
                  <option value="?????????">?????????</option>
                  <option value="?????????">?????????</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>?????????</Form.Label>
                <Form.Select
                  onChange={(e) => handleChange("product", e.target.value)}
                  value={input.product}
                >
                  <option>?????????</option>
                  <option value="??????">??????</option>
                  <option value="??????/??????">??????/??????</option>
                  <option value="??????">??????</option>
                  <option value="??????/??????">??????/??????</option>
                  <option value="?????????">?????????</option>
                  <option value="??????">??????</option>
                  <option value="?????????">?????????</option>
                  <option value="??????">??????</option>
                  <option value="????????????">????????????</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>??????</Form.Label>
                <Form.Select
                  value={input.channel}
                  onChange={(e) => handleChange("channel", e.target.value)}
                >
                  <option>??????</option>
                  <option value="??????">??????</option>
                  <option value="?????????">?????????</option>
                  <option value="?????????">?????????</option>
                  <option value="???????????????">???????????????</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>??????</Form.Label>
                <Form.Select
                  value={input.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                >
                  <option>??????</option>
                  <option value="??????">??????</option>
                  <option value="??????">??????</option>
                  <option value="??????">??????</option>
                  <option value="??????">??????</option>
                  <option value="??????">??????</option>
                  <option value="??????">??????</option>
                  <option value="??????">??????</option>
                  <option value="??????">??????</option>
                  <option value="?????????">?????????</option>
                  <option value="????????????">????????????</option>
                  <option value="????????????">????????????</option>
                  <option value="?????????">?????????</option>
                  <option value="????????????">????????????</option>
                  <option value="????????????">????????????</option>
                  <option value="????????????">????????????</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3 tw-w-[200px]">
                <Form.Label>????????????</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={"ex) 10"}
                  value={input.headcount}
                  onChange={(e) => handleChange("headcount", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3 tw-flex-1">
                <Form.Label>????????? URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"ex) https://naver.com"}
                  value={input.siteURL}
                  onChange={(e) => handleChange("siteURL", e.target.value)}
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3 ">
              <Form.Label>?????? ??????</Form.Label>
              <Form.Control
                type="text"
                placeholder={"ex) ?????? ????????? ????????? ????????? 2379-1"}
                value={input.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>?????????</Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  "???????????? ????????? ','(??????)??? ????????? ??????????????????. ex) ???,??????,???,???"
                }
                value={input.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
              />
            </Form.Group>

            <div className={"tw-mb-5"}>
              <Form.Label>??????</Form.Label>
              <FloatingLabel
                controlId="floatingTextarea2"
                label="?????????????????? ?????????"
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
              <Form.Label>????????????</Form.Label>
              <Form.Control
                type="text"
                placeholder={"????????????"}
                value={input.reward}
                onChange={(e) => handleChange("reward", e.target.value)}
              />
            </Form.Group>
            <div className="tw-flex">
              <Form.Group className="mb-3 ">
                <Form.Label>??????</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={"????????? ??????????????????"}
                  value={input.original_price}
                  onChange={(e) =>
                    handleChange("original_price", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>?????????</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={"???????????? ??????????????????"}
                  value={input.discount_price}
                  onChange={(e) =>
                    handleChange("discount_price", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>?????????</Form.Label>
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
              <Form.Label>????????? ??????</Form.Label>
              <FloatingLabel
                controlId="floatingTextarea2"
                label="????????? ??????????????? ???????????????"
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
                  <Form.Label>????????? ?????? ??????</Form.Label>
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
                  <Form.Label>????????? ?????? ??????</Form.Label>
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
                  <Form.Label>????????? ?????? ????????????</Form.Label>
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
                  <Form.Label>????????? ????????????</Form.Label>
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
                      ???????????? ??????
                    </span>
                  </label>
                </div>
              </div>
              <div className={"tw-flex tw-gap-2 "}>
                <Form.Group controlId="formFile" className="mb-3 tw-flex-1">
                  <Form.Label>????????? ??????</Form.Label>
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
                  <Form.Label>??????????????? ??????</Form.Label>
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
              ????????????
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
