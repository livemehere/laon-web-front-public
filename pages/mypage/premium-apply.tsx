import React, { useEffect } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/atoms/userAtom";
import { addressState } from "../../recoil/atoms/addressAtom";
import AxiosManager from "../../util/axiosManager";

interface Props {}

const PremiumApply: React.FC<Props> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const onSubmit: SubmitHandler<any> = async (data) => {
    const c = confirm(
      "마이페이지에 기입한 정보를 기준으로 심사됩니다. 신청하시겠습니까?"
    );
    if (c) {
      const r = await AxiosManager.post("/users/premium/application", {
        user_seq: user?.user_seq,
        agreement_content: 1,
      });

      if (r.status === 200) {
        return alert("신청되었습니다");
      } else {
        alert(r.response.data.message);
      }
    }
  };
  const onError: SubmitErrorHandler<any> = (errors) => console.log(errors);

  const [user, setUser] = useRecoilState(userState);
  const [address, setAddress] = useRecoilState(addressState);

  const getAddress = async () => {
    const addressResult = await AxiosManager.get("/users/address", {
      user_seq: user?.user_seq,
    });
    if (!user) return;
    setAddress(addressResult.data.addressBook); // 주소록 저장
  };

  useEffect(() => {
    getAddress();
    if (!user) return;
    setValue("user_name", user.name);
    setValue("phonenumber", user.phonenumber);
    setValue("birth", user.birth);
    setValue("gender", user.gender === "M" ? "남자" : "여자");
    setValue("blog", user.blog);
    setValue("instagram", user.instagram);
    setValue("youtube", user.youtube);
    setValue("influencer", user.influencer);
  }, [user]);

  return (
    <>
      <div className={"tw-px-5 tw-max-w-[600px] tw-m-auto"}>
        <h3 className={"tw-text-center tw-py-5"}>
          <img
            src="/images/logo.png"
            alt="logo"
            className={"tw-m-auto tw-w-[50%] tw-mb-2"}
          />
          <p>인플루언서 신청</p>
        </h3>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className={"tw-grid tw-grid-cols-2 tw-gap-y-2"}>
            <label className={"tw-flex tw-justify-between"}>
              <span className={"tw-pl-2 tw-flex tw-items-center"}>이름</span>
              <input
                type="text"
                disabled
                className={
                  "tw-border-black/10 tw-rounded tw-border-[1px] tw-p-1"
                }
                {...register("user_name", {
                  required: true,
                })}
              />
            </label>
            <label className={"tw-flex tw-justify-between"}>
              <span className={"tw-pl-2 tw-flex tw-items-center"}>연락처</span>
              <input
                type="text"
                disabled
                className={
                  "tw-border-black/10 tw-rounded tw-border-[1px] tw-p-1"
                }
                {...register("phonenumber", {
                  required: true,
                })}
              />
            </label>
            <label className={"tw-flex tw-justify-between"}>
              <span className={"tw-pl-2 tw-flex tw-items-center"}>
                출생년도
              </span>
              <input
                type="number"
                disabled
                className={
                  "tw-border-black/10 tw-rounded tw-border-[1px] tw-p-1"
                }
                {...register("birth", {
                  required: true,
                })}
              />
            </label>
            <label className={"tw-flex tw-justify-between"}>
              <span className={"tw-pl-2 tw-flex tw-items-center"}>성별</span>
              <input
                type="text"
                disabled
                className={
                  "tw-border-black/10 tw-rounded tw-border-[1px] tw-p-1"
                }
                {...register("gender", {
                  required: true,
                })}
              />
            </label>
          </div>
          <div className={"tw-px-2 tw-mt-5 tw-mb-3"}>
            <Row
              className={"tw-bg-gray-100 tw-border-y-[1px] tw-border-gray-300"}
            >
              <Col className={"tw-text-center tw-p-1"}>배송지</Col>
              <Col className={"tw-text-center tw-p-1"}>받는이</Col>
              <Col className={"tw-text-center tw-p-1"}>주소/휴대폰번호</Col>
            </Row>
            {/*  주소록 배열 돌기 */}
            {address &&
              address.map((a) => (
                <Row key={a.address_seq}>
                  <Col className={"tw-text-center tw-p-1"}>
                    {a.name}{" "}
                    {a.is_default === 1 && (
                      <span className={"tw-text-xs"}>(기본배송지)</span>
                    )}
                  </Col>
                  <Col className={"tw-text-center tw-p-1"}>{a.receiver}</Col>
                  <Col className={"tw-text-center tw-p-1 tw-text-xs"}>
                    {a.address}
                    <br />
                    <span className={"tw-text-gray-500"}>{a.phonenumber}</span>
                  </Col>
                </Row>
              ))}
          </div>
          <label className={"tw-flex tw-justify-between tw-mb-3"}>
            <span
              className={
                "tw-px-2 tw-flex tw-items-center tw-gap-1 tw-font-bold  tw-flex-[1]"
              }
            >
              <img src="/images/min_blog_icon.png" alt="icon" /> 네이버 블로그
            </span>
            <input
              type="text"
              disabled
              className={
                "tw-border-black/10 tw-rounded tw-border-[1px] tw-p-1  tw-flex-[2]"
              }
              {...register("blog", {
                required: true,
              })}
            />
          </label>
          <label className={"tw-flex tw-justify-between tw-mb-3"}>
            <span
              className={
                "tw-px-2 tw-flex tw-items-center tw-gap-1 tw-font-bold  tw-flex-[1]"
              }
            >
              <img src="/images/min_instagram_icon.png" alt="icon" /> 인스타그램
            </span>
            <input
              type="text"
              disabled
              className={
                "tw-border-black/10 tw-rounded tw-border-[1px] tw-p-1  tw-flex-[2]"
              }
              {...register("instagram", {
                required: true,
              })}
            />
          </label>
          <label className={"tw-flex tw-justify-between tw-mb-3"}>
            <span
              className={
                "tw-px-2 tw-flex tw-items-center tw-gap-1 tw-font-bold  tw-flex-[1]"
              }
            >
              <img
                src="/images/naver_premium.png"
                alt="icon"
                className={"tw-w-[25px]"}
              />
              인플루언서
            </span>
            <input
              type="text"
              disabled
              className={
                "tw-border-black/10 tw-rounded tw-border-[1px] tw-p-1  tw-flex-[2]"
              }
              {...register("influencer", {
                required: true,
              })}
            />
          </label>
          <label className={"tw-flex tw-justify-between tw-mb-8"}>
            <span
              className={
                "tw-px-2 tw-flex tw-items-center tw-gap-1 tw-font-bold tw-flex-[1]"
              }
            >
              <img
                src="/images/min_youtube_icon.png"
                alt="icon"
                className={"tw-w-[25px] "}
              />
              유튜브
            </span>
            <input
              type="text"
              disabled
              className={
                "tw-border-black/10 tw-rounded tw-border-[1px] tw-p-1 tw-flex-[2]"
              }
              {...register("youtube", {
                required: true,
              })}
            />
          </label>
          <div>* 마이페이지에 기입된 정보를 기반으로 신청됩니다.</div>
          <div>
            * 정보가 정확하지 않다면 마이페이지에서 수정 후 다시 시도해주세요
          </div>
          <button
            className={
              "tw-bg-primary tw-text-white tw-py-2 tw-px-12 tw-block tw-m-auto tw-mt-2"
            }
          >
            프리미엄 신청하기
          </button>
        </form>
      </div>
    </>
  );
};

export default PremiumApply;
