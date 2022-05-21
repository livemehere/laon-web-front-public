import React, { useEffect } from "react";
import Layout from "../common/layout";
import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import Input from "../common/input";
import CheckLabel from "../common/checkLabel";
import Button from "../common/Button";
import TextLinkButton from "../common/TextLinkButton";
import SelectBox from "../common/SelectBox";
import Footer from "../common/footer";
import useInput from "../../hooks/useInput";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { areaOnlyBig } from "../../util/areaDetailList";
import AxiosManager from "../../util/axiosManager";
import { useRouter } from "next/router";

interface AdQueryWrapProps {}

export interface QueryType {
  email: string;
  area: string;
  phonenumber: string;
  agreement_mms: number;
  agreement_info: number;
}

const AdQueryWrap: React.FC<AdQueryWrapProps> = ({ children }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const router = useRouter();

  const onSubmit: SubmitHandler<any> = async (data) => {
    const r = await AxiosManager.post("/advertisement", {
      company_name: data.name,
      contact: data.phonenumber,
      area: data.area,
      isagency: data.area ? 1 : 0,
      agreement_info: data.agreement_info ? 1 : 0,
    });

    if (r.status === 200) {
      alert("신청되었습니다");
      router.back();
    } else {
      alert("신청에 실패하였습니다");
    }
  };
  const onError: SubmitErrorHandler<any> = (errors) => {
    if (errors.agreement_info) return alert("필수항목에 동의해주세요");
  };

  return (
    <>
      <Layout className="tw-max-w-[400px] tw-m-auto">
        <Row>
          <Col>
            <div className="tw-relative tw-w-[180px] tw-h-[150px] tw-m-auto tw-mt-5">
              <Image src="/images/메인로고.png" layout="fill" alt="logo" />
            </div>
            <p className="tw-text-center tw-font-bold tw-mt-3">
              SNS 체험단부터 네이버 광고와 가맹 홍보까지!
            </p>
            <p className="tw-text-center tw-text-xs">
              지금 상담 신청하시면, 전문 컨설턴트가 1:1 무료 컨설팅을
              진행해드려요.
            </p>
          </Col>
        </Row>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Row>
            <Col className={"tw-mb-2"}>
              <input
                type="text"
                placeholder="업체명을 남겨주세요 *"
                {...register("name", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                })}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
              {errors.name && (
                <div className={"tw-text-red-400"}>{errors.name.message}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col className={"tw-mb-2"}>
              <select
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                {...register("area", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                })}
              >
                {areaOnlyBig.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {errors.area && (
                <div className={"tw-text-red-400"}>{errors.area.message}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col className={"tw-mb-2"}>
              <input
                type="text"
                placeholder="연락처를 남겨주세요 *"
                {...register("phonenumber", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                  pattern: {
                    value: /^[0-9]+$/g,
                    message: "숫자만 입력해주세요",
                  },
                })}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
              {errors.phonenumber && (
                <div className={"tw-text-red-400"}>
                  {errors.phonenumber.message}
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col className={"tw-mb-2"}>
              <input
                type="text"
                placeholder="담당자 성함을 알려주세요 *"
                {...register("name", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                })}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
              {errors.name && (
                <div className={"tw-text-red-400"}>{errors.name.message}</div>
              )}
            </Col>
          </Row>
          <Row>
            <Col className={"tw-mb-2"}>
              <input
                type="text"
                placeholder="이메일을 남겨주세요 *"
                {...register("email", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    message: "올바른 이메일 형식을 작성해주세요",
                  },
                })}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
              {errors.email && (
                <div className={"tw-text-red-400"}>{errors.email.message}</div>
              )}
            </Col>
          </Row>
          <Row>
            <div className="tw-px-3 tw-mb-5">
              <div>
                <label>
                  <input type="checkbox" {...register("agreement_mms")} />
                  <span className={`tw-text-black tw-pl-2`}>
                    (선택) 대행사라면 체크해주세요.
                  </span>
                </label>
              </div>
            </div>
          </Row>
          <Row>
            <Col className="tw-my-2">
              <p className="tw-mb-0 tw-text-sm tw-text-red-500">
                개인정보 수집 및 이용 동의 *
              </p>
              <div>
                <label>
                  <input
                    type="checkbox"
                    {...register("agreement_info", {
                      required: {
                        value: true,
                        message: "필수 입력값입니다",
                      },
                    })}
                  />
                  <span className={`tw-text-black tw-pl-2 tw-underline`}>
                    개인정보 수집 이용 및 마케팅 활용 전체 동의하기
                  </span>
                </label>
              </div>
            </Col>
          </Row>
          <Row className="tw-mb-[100px]">
            <Col>
              <button
                className={"tw-bg-primary tw-text-white tw-w-[100%] tw-py-3"}
              >
                상담 신청하기
              </button>
            </Col>
          </Row>
        </form>
      </Layout>
    </>
  );
};

export default AdQueryWrap;
