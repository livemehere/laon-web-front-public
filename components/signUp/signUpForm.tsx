import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "../common/Button";
import CheckLabel from "../common/checkLabel";
import Input from "../common/input";
import TabMemu from "../common/tabmenu";
import TextLinkButton from "../common/TextLinkButton";
import Divider from "../common/divider";
import Layout from "../common/layout";
import { useRecoilState } from "recoil";
import { userState, UserType } from "../../recoil/atoms/userAtom";
import useInput from "../../hooks/useInput";
import { AiOutlineHeart } from "react-icons/ai";
import { useRouter } from "next/router";
import AxiosManager from "../../util/axiosManager";
import { FieldValue, useForm } from "react-hook-form";
import {
  SubmitErrorHandler,
  SubmitHandler,
} from "react-hook-form/dist/types/form";
import Link from "next/link";

interface SignUpFormProps {}

interface SignUpType {
  user_id: string;
  user_password: string;
  user_name: string;
  user_nickname: string;
  user_email: string;
  user_phonenumber: string;
  agreement_info: 0 | 1;
  agreement_email: 0 | 1;
  agreement_mms: 0 | 1;
  is_advertiser: 0 | 1;
  is_admin: 0 | 1;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ children }) => {
  const router = useRouter();
  const menuList = ["리뷰어", "광고주"];
  const [selected, setSelected] = useState(menuList[0]);
  const [user, setUser] = useRecoilState(userState);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit: SubmitHandler<any> = (data) => handleSignUp(data);
  const onError: SubmitErrorHandler<any> = (errors) => console.log(errors);
  const handleSelect = (title: string) => {
    setSelected(title);
  };

  //TODO: 휴대폰 본인 확인 검증 추가하기(하면 이름 나오니까 그거 user_name에 넣기
  const handleSignUp: SubmitHandler<any> = async (data) => {
    // 비밀번호 동일 검사
    if (data.password !== data.password2) {
      return alert("비밀번호가 틀립니다");
    }
    // 이메일(=아이디) 중복체크
    const result_checkId = await AxiosManager.get("/auth/checkID", {
      user_id: data.email,
    });

    if (!result_checkId.data.flag) {
      return alert("이미 존재하는 이메일입니다.");
    } else {
      alert("사용 가능한 아이디입니다.");
    }

    const finalData: SignUpType = {
      user_id: data.email,
      user_password: data.password,
      user_name: data.user_name,
      user_nickname: data.user_nickname,
      user_email: data.email,
      user_phonenumber: data.user_phonenumber,
      agreement_info: data.agreement_info ? 1 : 0,
      agreement_email: data.agreement_email ? 1 : 0,
      agreement_mms: data.agreement_mms ? 1 : 0,
      is_advertiser: selected === "광고주" ? 0 : 1,
      is_admin: data.is_admin ? 1 : 0,
    };

    // 회원가입 API요청
    const result = await AxiosManager.post("/auth/new", finalData);
    console.log(result);
    if (result?.status === 500) {
      return alert(result.data.message);
    } else if (result?.status === 200) {
      alert("성공적으로 가입되었습니다");
      router.push("/signin");
    } else {
      alert("회원가입에 실패하였습니다");
    }
  };

  return (
    <>
      <Layout className="tw-max-w-[400px] tw-m-auto">
        <Row>
          <Col>
            <div className="tw-relative tw-w-[180px] tw-h-[150px] tw-m-auto tw-mt-5">
              <Link href={"/"}>
                <Image
                  src="/images/메인로고.png"
                  layout="fill"
                  alt="logo"
                  className={"tw-cursor-pointer"}
                />
              </Link>
            </div>
          </Col>
        </Row>
        <Row className="tw-my-5">
          <Col>
            <TabMemu
              selected={selected}
              menuList={menuList}
              handleClick={handleSelect}
            />
          </Col>
        </Row>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Row>
            <Col>
              <input
                type="text"
                placeholder="이메일"
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
            <Col>
              <div className={`tw-my-1 tw-relative `}>
                <input
                  type="password"
                  placeholder={"비밀번호"}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "필수 입력값입니다",
                    },
                    minLength: {
                      value: 8,
                      message: "최소 8자 이상이어야 합니다",
                    },
                    pattern: {
                      value: /[a-zA-Z0-9]/,
                      message: "영문 소문자/숫자 로만 구성되어야합니다",
                    },
                  })}
                  className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                />
                {/* span 은 생략가능 (오른쪽 끝에 뭐 넣고싶을때 쓰기) */}
                <span
                  className={`tw-absolute tw-right-[5px] tw-top-[50%] tw-translate-y-[-50%] tw-text-xs tw-text-gray-400`}
                >
                  영문자/숫자 8자 이상
                </span>
              </div>
              {errors.password && (
                <div className={"tw-text-red-400"}>
                  {errors.password.message}
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <input
                type="password"
                placeholder="비밀번호 확인"
                {...register("password2", {
                  required: {
                    value: true,
                    message: "필수 입력값입니다",
                  },
                })}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
              {errors.password2 && (
                <div className={"tw-text-red-400"}>
                  {errors.password2.message}
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={`tw-my-1 tw-relative `}>
                <input
                  type="text"
                  placeholder="휴대폰 번호 ex) - 없이 입력해주세요"
                  {...register("user_phonenumber", {
                    required: {
                      value: true,
                      message: "필수 입력값입니다",
                    },
                    pattern: {
                      value: /[0-9]/g,
                      message: "숫자만 입력해주세요",
                    },
                  })}
                  className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                />
                {/* span 은 생략가능 (오른쪽 끝에 뭐 넣고싶을때 쓰기) */}
                <span
                  className={`tw-absolute tw-right-[5px] tw-top-[50%] tw-translate-y-[-50%] tw-text-xs tw-text-gray-400`}
                >
                  <button className="tw-bg-primary tw-text-white tw-p-1">
                    휴대폰 본인 확인
                  </button>
                </span>
              </div>
              {errors.user_phonenumber && (
                <div className={"tw-text-red-400"}>
                  {errors.user_phonenumber.message}
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={`tw-my-1 tw-relative `}>
                <input
                  type="text"
                  placeholder="닉네임"
                  {...register("user_nickname", {
                    required: {
                      value: true,
                      message: "필수 입력값입니다",
                    },
                    pattern: {
                      value: /^[가-힣a-zA-Z0-9]+$/,
                      message: "특수문자 제외입니다",
                    },
                    minLength: {
                      value: 3,
                      message: "최소 3자 이상이어야 합니다",
                    },
                    maxLength: {
                      value: 15,
                      message: "닉네임이 너무 깁니다",
                    },
                  })}
                  className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                />
                <span
                  className={`tw-absolute tw-right-[5px] tw-top-[50%] tw-translate-y-[-50%] tw-text-xs tw-text-gray-400`}
                >
                  특수문자 제외/최소 3자 이상
                </span>
              </div>
              {errors.user_nickname && (
                <div className={"tw-text-red-400"}>
                  {errors.user_nickname.message}
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={`tw-my-1 tw-relative `}>
                <input
                  type="text"
                  placeholder="이름"
                  // value={input?.user_name}
                  // onChange={(e) => handleChange("user_name", e.target.value)}
                  {...register("user_name", {
                    required: {
                      value: true,
                      message: "필수 입력값입니다",
                    },
                    pattern: {
                      value: /^[가-힣]+$/,
                      message: "한글만 입력해주세요",
                    },
                  })}
                  className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                />
              </div>
              {errors.user_name && (
                <div className={"tw-text-red-400"}>
                  {errors.user_name.message}
                </div>
              )}
            </Col>
          </Row>
          <Row>
            <Col className="tw-my-2">
              <div>
                <label>
                  <input
                    type="checkbox"
                    {...register("agreement_info", {
                      required: {
                        value: true,
                        message: "필수 동의항목입니다",
                      },
                    })}
                  />
                  <span className={`tw-text-gray-500 tw-pl-2`}>
                    개인정보취급방침 및 서비스 이용약관 동의(필수)
                  </span>
                </label>
                {errors.agreement_info && (
                  <div className={"tw-text-red-400"}>
                    {errors.agreement_info.message}
                  </div>
                )}
              </div>
              <div>
                <label>
                  <input type="checkbox" {...register("agreement_mms")} />
                  <span className={`tw-text-gray-500 tw-pl-2`}>
                    이메일 수신 및 SMS 수신 동의(선택)
                  </span>
                </label>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                text="동의하고 가입완료"
                bgColor={
                  Object.keys(errors).length === 0
                    ? "!tw-bg-primary"
                    : "tw-bg-gray-500"
                }
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Divider />
            </Col>
          </Row>
        </form>
        {/**/}
        {/*<Row className="tw-mb-2">*/}
        {/*  <Col>*/}
        {/*    <Button*/}
        {/*      text="네이버 아이디로 로그인"*/}
        {/*      bgColor="tw-bg-white"*/}
        {/*      fontColor="tw-text-black"*/}
        {/*      border*/}
        {/*    />*/}
        {/*  </Col>*/}
        {/*</Row>*/}
      </Layout>
      <Row className="tw-my-5 tw-pt-2">
        <div className="tw-divide-x-[1px] tw-flex tw-justify-center tw-text-sm">
          <TextLinkButton url={"/"}>라온디어스 체험단 소개</TextLinkButton>
          <TextLinkButton url={"/termofuse"}>이용약관</TextLinkButton>
          <TextLinkButton url={"/privacypolicy"}>
            개인정보처리방침
          </TextLinkButton>
          <TextLinkButton url={"/emailpolicy"}>운영정책</TextLinkButton>
          <TextLinkButton
            url={"#"}
            onClick={() => {
              if (!user?.user_seq) return alert("로그인 후 이용해주세요");
            }}
          >
            고객센터
          </TextLinkButton>
        </div>
      </Row>
      <Layout>
        <Row>
          <Col>
            <p className="tw-text-center tw-text-primary tw-text-sm">
              COPYRIGHT © (주)라온디어스 ALL RIGHT RESERVED
            </p>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default SignUpForm;
