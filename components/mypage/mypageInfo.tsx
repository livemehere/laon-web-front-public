import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from "../common/Button";
import TextInputRow from "../common/textInputRow";
import Divider from "../common/divider";
import JustDisplayTable from "./JustDisplayTable";
import InterestListBox from "../iconBoxComponents/interestListBox";
import AreaListBox from "../iconBoxComponents/areaListBox";
import MediaListBox from "../iconBoxComponents/mediaListBox";
import useInput from "../../hooks/useInput";
import { useRecoilState } from "recoil";
import { userState, UserType } from "../../recoil/atoms/userAtom";
import AddressModal from "./addressModal";
import { addressState, AddressType } from "../../recoil/atoms/addressAtom";
import AxiosManager from "../../util/axiosManager";
import { additionalInfoState } from "../../recoil/atoms/additionalInfo";
import useLogout from "../../hooks/useLogout";
import axios from "axios";

interface MyPageInfoProps {}

export interface AdditionalInputType {
  interest: any[];
  area: any[];
  channel: any[];
}

export type HandleAdditionalInfoType = (
  title: keyof AdditionalInputType,
  item: string
) => void;

const MyPageInfo: React.FC<MyPageInfoProps> = ({ children }) => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [address, setAddress] = useRecoilState(addressState);
  const { input, handleChange, setInput } = useInput<UserType | null>(user);
  const [selectedAdd, setSelectedAdd] = useState<AddressType | null>(null);
  const [isSns, setIsSns] = useState<boolean>(false);
  const [additionalInfo, setAdditionalInfo] =
    useRecoilState(additionalInfoState);
  const handleLogout = useLogout();

  const getUser = async () => {
    AxiosManager.setToken(
      window.localStorage.getItem("accessToken") || "",
      window.localStorage.getItem("refreshToken") || ""
    );
    AxiosManager.createInstance();
    const r = await AxiosManager.post("/auth/login/token");
    console.log("자동 토큰 로그인 결과", r);
    if (r.status === 200) {
      setUser(r.data.user);
      window.localStorage.setItem("accessToken", r.data.data.accessToken);
      window.localStorage.setItem("refreshToken", r.data.data.refreshToken);
    }
  };

  const handleSaveDetailInfo = async () => {
    const result = await AxiosManager.patch("/users/info/additional", {
      user_seq: user?.user_seq,
      tops_size: input?.tops_size,
      bottoms_size: input?.bottoms_size,
      shoe_size: input?.shoe_size,
      height: input?.height,
      skin_type: input?.skin_type,
      marital_status: input?.marital_status,
      having_child: input?.having_child,
      job: input?.job,
      companion_animal: input?.companion_animal,
    });

    console.log(result);

    if (result.status === 200) {
      alert("저장되었습니다");
      getUser();
    }
  };

  const passwordState = useInput({
    password: "",
    password2: "",
  });

  const [additionalInfoInput, setAdditionalInfoInput] =
    useState<AdditionalInputType>({
      interest: [],
      area: [],
      channel: [],
    });

  const handleAdditionalInfo: HandleAdditionalInfoType = (title, item) => {
    const newAdditionalInfo = { ...additionalInfoInput };
    if (additionalInfoInput[title].includes(item)) {
      newAdditionalInfo[title] = newAdditionalInfo[title].filter(
        (a) => a !== item
      );
    } else {
      newAdditionalInfo[title].push(item);
    }
    setAdditionalInfoInput(newAdditionalInfo);
  };

  useEffect(() => {
    const codeOnlyAdditionalInfo = {
      interest: additionalInfo?.interest.map((i) => i.user_interest_code) || [],
      area: additionalInfo?.area.map((i) => i.user_area_code) || [],
      channel: additionalInfo?.channel.map((i) => i.user_channel_code) || [],
    };
    console.log("additionalInfo", additionalInfo);
    setAdditionalInfoInput(codeOnlyAdditionalInfo);
  }, [additionalInfo]);

  useEffect(() => {
    setInput(user);

    if (!user?.user_seq) return;
    getAdditionalInfo(user?.user_seq);
  }, [user]);

  // sns 로그인인가에따라 true ,false
  useEffect(() => {
    const isSns = window.localStorage.getItem("is_sns");
    if (isSns === "true") {
      setIsSns(true);
    } else {
      setIsSns(false);
    }
  }, []);

  const handleChangePassword = async () => {
    if (passwordState.input.password !== passwordState.input.password2)
      return alert("비밀번호가 다릅니다.");
    // TODO:   API request to change password
    if (
      !/^[a-zA-Z0-9]+$/.test(passwordState.input.password) ||
      passwordState.input.password.length < 8
    ) {
      return alert("영문자/숫자로 최소 8자이상입니다");
    }

    const result = await AxiosManager.patch("/users/password", {
      user_seq: input?.user_seq,
      password: passwordState.input.password,
    });

    if (result.status === 200) {
      alert("변경되었습니다");
    } else {
      alert("변경 실패");
    }

    passwordState.handleChange("password", "");
    passwordState.handleChange("password2", "");
  };

  const handleCreateNewAddress = () => {
    setShow(true);
  };
  const handleModifyAddress = (addr: AddressType) => {
    setShow(true);
    setSelectedAdd(addr);
  };
  const handleAddressRemove = async (address_seq: number) => {
    if (confirm("삭제하시겠습니까?")) {
      const result = await AxiosManager.delete("/users/address", {
        user_seq: user?.user_seq,
        address_seq,
      });
      if (result.status === 200) {
        alert("삭제되었습니다");
        setAddress((prev) =>
          [...prev!].filter((a) => a.address_seq !== address_seq)
        );
      }
    }
  };
  const handleSaveUserInfo = async () => {
    const result = await AxiosManager.patch("/users", {
      user_seq: input?.user_seq,
      name: input?.name,
      gender: input?.gender,
      birth: input?.birth,
      nickname: input?.nickname,
      phonenumber: input?.phonenumber,
      email: input?.email,
      agreement_mms: input?.agreement_mms,
      agreement_email: input?.agreement_email,
      agreement_info: input?.agreement_info,
    });

    if (result.status === 200) {
      alert("저장되었습니다");
      setUser({
        ...user!,
        name: input?.name!,
        gender: input?.gender,
        birth: input?.birth,
        nickname: input?.nickname!,
        phonenumber: input?.phonenumber!,
        agreement_mms: input?.agreement_mms!,
        agreement_email: input?.agreement_email!,
        agreement_info: input?.agreement_info!,
      });
    }
  };
  const handleSaveUserOtherInfo = async () => {
    const result = await AxiosManager.patch("/users/sns", {
      user_seq: input?.user_seq,
      blog: input?.blog,
      instagram: input?.instagram,
      influencer: input?.influencer,
      youtube: input?.youtube,
    });
    console.log(result);
    if (result.status === 200) {
      setUser({
        ...user!,
        blog: input?.blog,
        instagram: input?.instagram,
        influencer: input?.influencer,
        youtube: input?.youtube,
      });
      handleSaveAdditionalInfo();
    }
  };
  const getAdditionalInfo = async (seq: number) => {
    const additionalInfoResult = await AxiosManager.get("/users/additional", {
      user_seq: seq,
    });
    console.log(additionalInfoResult);
    setAdditionalInfo(additionalInfoResult.data.additionalInfo);
  };

  const handleSaveAdditionalInfo = async () => {
    const result = await AxiosManager.patch("/users/additional", {
      user_seq: user?.user_seq,
      interest: additionalInfoInput.interest.join(","),
      channel: additionalInfoInput.channel.join(","),
      area: additionalInfoInput.area.join(","),
    });

    if (result.status === 200) {
      getAdditionalInfo(user?.user_seq!);
      handleSaveDetailInfo();
    }
  };

  const handleRemoveUser = async () => {
    const agree = window.confirm("정말 탈퇴하시겠습니까?");
    if (!agree) {
      return;
    } else {
      // kakaoLogout();
      // return;
      const r = await AxiosManager.delete("/auth", {
        user_seq: user?.user_seq,
      });
      console.log(r);
      if (r.status === 200) {
        alert("탈퇴되었습니다. 이용해주셔서 감사합니다.");
        handleLogout();
      } else {
        alert("탈퇴 중 오류가 발생하였습니다.");
      }
    }
  };

  return (
    <div className={"children-margin"}>
      <TextInputRow
        left={<div className="tw-font-bold">이름</div>}
        right={
          <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
            <input
              type="text"
              value={input?.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
            />
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">성별</div>}
        right={
          <div className="tw-flex tw-gap-8">
            <div>
              <label>
                <input
                  type="radio"
                  value="m"
                  name="gender"
                  className="tw-mr-1"
                  checked={input?.gender === "m" || input?.gender === "M"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                />
                <span>남자</span>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  value="f"
                  name="gender"
                  className="tw-mr-1"
                  checked={input?.gender === "f" || input?.gender === "F"}
                  onChange={(e) => handleChange("gender", e.target.value)}
                />
                <span>여자</span>
              </label>
            </div>
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">출생년도</div>}
        right={
          <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
            <input
              type="number"
              placeholder="출생년도를 입력하세요"
              value={input?.birth}
              maxLength={4}
              onChange={(e) => {
                if (e.target.value.length > 4) return;
                handleChange("birth", e.target.value);
              }}
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
            />
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">닉네임</div>}
        right={
          <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
            <input
              type="text"
              placeholder="닉네임 입력하세요"
              value={input?.nickname}
              onChange={(e) => handleChange("nickname", e.target.value)}
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              maxLength={10}
            />
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">아이디(이메일)</div>}
        right={
          <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
            <input
              type="text"
              placeholder="laondeas@naver.com"
              disabled
              value={input?.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
            />
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">휴대폰 번호</div>}
        right={
          <div className="tw-flex">
            <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
              <input
                type="text"
                placeholder="ex) 010-XXXX-XXXX"
                value={input?.phonenumber}
                disabled
                onChange={(e) => handleChange("phonenumber", e.target.value)}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
            </div>
            <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
              <input
                type="button"
                disabled
                value="인증번호 요청"
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                onClick={() => alert("인증요청")}
              />
            </div>
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">배송지</div>}
        right={
          <div className={""}>
            <Row
              className={"tw-bg-gray-100 tw-border-y-[1px] tw-border-gray-300"}
            >
              <Col className={"tw-text-center tw-p-1"}>배송지</Col>
              <Col className={"tw-text-center tw-p-1"}>받는이</Col>
              <Col className={"tw-text-center tw-p-1"}>주소/휴대폰번호</Col>
              <Col className={"tw-text-center tw-p-1"}>수정 / 삭제</Col>
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
                  <Col className={"tw-text-center tw-p-1"}>
                    <button
                      className={
                        "tw-bg-primary tw-text-white tw-px-1 tw-rounded-sm hover:tw-bg-blue-900 tw-mr-1"
                      }
                      onClick={() => handleModifyAddress(a)}
                    >
                      수정
                    </button>
                    <button
                      className={
                        "tw-bg-red-400 tw-text-white tw-px-1 tw-rounded-sm hover:tw-bg-red-500"
                      }
                      onClick={() => handleAddressRemove(a.address_seq)}
                    >
                      삭제
                    </button>
                  </Col>
                </Row>
              ))}
            {/*  등록 버튼 */}
            <Row className={"tw-border-b-[1px] tw-border-gray-300"}>
              <div
                className={
                  "tw-text-center hover:tw-bg-gray-100 cursor-pointer hover:tw-cursor-pointer"
                }
                onClick={handleCreateNewAddress}
              >
                + 배송지등록
              </div>
            </Row>
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">수집동의</div>}
        right={
          <div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={input?.agreement_email === 1}
                  onChange={(e) =>
                    handleChange("agreement_email", e.target.checked ? 1 : 0)
                  }
                />
                <span className={`tw-text-gray-500 tw-pl-2`}>
                  이메일을 통한 캠페인 모집 및 추천, 설문조사, 이벤트 정보 등의
                  수신에 동의합니다.
                </span>
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={input?.agreement_mms === 1}
                  onChange={(e) =>
                    handleChange("agreement_mms", e.target.checked ? 1 : 0)
                  }
                />
                <span className={`tw-text-gray-500 tw-pl-2`}>
                  문자를 통한 캠페인 모집 및 추천, 설문조사, 이벤트 정보 등의
                  수신에 동의합니다.
                </span>
              </label>
            </div>
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">개인정보이용동의</div>}
        right={
          <div className={"children-margin"}>
            <JustDisplayTable headers={["목적", "항목", "보유 및 이용기간"]} />
            <div>
              <label>
                <input
                  type="checkbox"
                  disabled
                  checked={input?.agreement_info === 1}
                  onChange={(e) =>
                    handleChange("agreement_info", e.target.checked ? 1 : 0)
                  }
                />
                <span className={`tw-text-gray-500 tw-pl-2`}>
                  개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
            </div>
          </div>
        }
      />
      <Divider mount={"200"} />
      <Row>
        <div className={"!tw-w-[300px] tw-mx-auto !tw-my-10"}>
          {/*  onClick={handleSaveUser}*/}
          <Button text={"개인정보 저장"} onClick={handleSaveUserInfo} />
        </div>
      </Row>
      <Divider mount={"200"} />
      <Row>
        <h4>비밀번호 수정</h4>
      </Row>
      <TextInputRow
        left={<div className="tw-font-bold">새 비밀번호</div>}
        right={
          <div>
            <div className={`tw-my-1 tw-relative !tw-max-w-[300px]`}>
              <input
                type="password"
                placeholder={"새 비밀번호를 입력하세요"}
                value={passwordState.input.password}
                disabled={isSns ? true : false}
                onChange={(e) =>
                  passwordState.handleChange("password", e.target.value)
                }
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 "
              />
              <span
                className={`tw-absolute tw-right-[5px] tw-top-[50%] tw-translate-y-[-50%] tw-text-xs tw-text-gray-400`}
              >
                영문자/숫자 8자 이상
              </span>
            </div>
          </div>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold">새 비밀번호 확인</div>}
        right={
          <div>
            <input
              type="password"
              placeholder={"비밀번호 확인"}
              disabled={isSns ? true : false}
              value={passwordState.input.password2}
              onChange={(e) =>
                passwordState.handleChange("password2", e.target.value)
              }
              className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 !tw-max-w-[300px]"
            />
          </div>
        }
      />
      <Row>
        <div className={"!tw-w-[300px] tw-mx-auto !tw-my-10"}>
          {/*  onClick={handleChangePassword}*/}
          <Button text={"비밀번호 저장"} onClick={handleChangePassword} />
        </div>
      </Row>
      <TextInputRow
        className={"!tw-items-start"}
        left={<div className="tw-font-bold tw-pt-3">내 블로그</div>}
        right={
          <div>
            <div className={"tw-flex tw-items-center tw-gap-1"}>
              <span>https://blog.naver.com/</span>
              <input
                type="text"
                placeholder="url"
                value={input?.blog}
                onChange={(e) => handleChange("blog", e.target.value)}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
            </div>
            <div className={"tw-mt-3"}>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                등록 및 변경하고자 하는 블로그 URL 혹은 RSS를 입력해 주세요.
              </p>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                1개 이상의 포스팅이 외부에 검색가능한 상태일때에만 블로그 등록이
                가능합니다.
              </p>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                모바일 URL은 지원하지 않으니 PC에서 확인하신URL을 등록해주세요.
              </p>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                인플루언서 등록에 어려움이 있으시다면 1:1문의에 남겨주세요.
              </p>
            </div>
          </div>
        }
      />
      <TextInputRow
        className={"!tw-items-start"}
        left={<div className="tw-font-bold tw-pt-3">인스타그램</div>}
        right={
          <div>
            <div className={"tw-flex tw-items-center tw-gap-1"}>
              <span>https://instagram.com/</span>
              <input
                type="text"
                placeholder="url"
                value={input?.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
            </div>
            <div className={"tw-mt-3"}>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                참여하고 있는 캠페이인이 있는 경우, 기존 라온디어스 체험단에
                연결했던 계정을 연결하셔야 참여를 이어가실 수 있습니다.
              </p>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                라온디어스 체험단 인스타그램 1개의 계정에 연결 하실 수 있습니다.
              </p>
            </div>
          </div>
        }
      />
      <TextInputRow
        className={"!tw-items-start"}
        left={<div className="tw-font-bold tw-pt-3">인플루언서</div>}
        right={
          <div>
            <div className={"tw-flex tw-items-center tw-gap-1"}>
              <span>https://in.naver.com/</span>
              <input
                type="text"
                placeholder="url"
                value={input?.influencer}
                onChange={(e) => handleChange("influencer", e.target.value)}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
            </div>
            <div className={"tw-mt-3"}>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                등록 및 변경하고자 하는 블로그 URL 혹은 RSS를 입력해 주세요.
              </p>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                1개 이상의 포스팅이 외부에 검색가능한 상태일때에만 블로그 등록이
                가능합니다.
              </p>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                모바일 URL은 지원하지 않으니 PC에서 확인하신URL을 등록해주세요.
              </p>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                인플루언서 등록에 어려움이 있으시다면 1:1문의에 남겨주세요.
              </p>
            </div>
          </div>
        }
      />
      <TextInputRow
        className={"!tw-items-start"}
        left={<div className="tw-font-bold tw-pt-3">유튜브</div>}
        right={
          <div>
            <div className={"tw-flex tw-items-center tw-gap-1"}>
              <input
                type="text"
                placeholder="url"
                value={input?.youtube}
                onChange={(e) => handleChange("youtube", e.target.value)}
                className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
              />
            </div>
            <div className={"tw-mt-3"}>
              <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}></p>
            </div>
          </div>
        }
      />
      <Divider mount={"200"} />

      <TextInputRow
        left={<div className="tw-font-bold">관심사</div>}
        right={
          <InterestListBox
            additionalInfo={additionalInfoInput}
            handleAdditionalInfo={handleAdditionalInfo}
          />
        }
      />
      <Divider mount={"200"} />
      <TextInputRow
        left={<div className="tw-font-bold">지역</div>}
        right={
          <AreaListBox
            additionalInfo={additionalInfoInput}
            handleAdditionalInfo={handleAdditionalInfo}
          />
        }
      />
      <Divider mount={"200"} />
      <TextInputRow
        left={<div className="tw-font-bold">미디어 채널</div>}
        right={
          <MediaListBox
            additionalInfo={additionalInfoInput}
            handleAdditionalInfo={handleAdditionalInfo}
          />
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold tw-mt-5">사이즈 정보</div>}
        right={<></>}
      />
      <TextInputRow
        left={<div className="">상의 사이즈</div>}
        right={
          <select
            className={
              "tw-border-primary tw-border-[1px] tw-w-[300px] tw-p-2 tw-rounded"
            }
            value={input?.tops_size}
            onChange={(e) => handleChange("tops_size", e.target.value)}
          >
            <option value={""} disabled selected>
              선택해 주세요
            </option>
            <option value={"S"}>S(44,90)</option>
            <option value={"M"}>M(55,95)</option>
            <option value={"L"}>L(66,100)</option>
            <option value={"XL"}>XL(77.105)</option>
            <option value={"2XL"}>2XL(88,110)</option>
            <option value={"3XL"}>3XL(99,115)</option>
          </select>
        }
      />
      <TextInputRow
        left={<div className="">하의 사이즈</div>}
        right={
          <select
            className={
              "tw-border-primary tw-border-[1px] tw-w-[300px] tw-p-2 tw-rounded"
            }
            value={input?.bottoms_size}
            onChange={(e) => handleChange("bottoms_size", e.target.value)}
          >
            <option value={""} disabled selected>
              선택해 주세요
            </option>
            <option value={"24-25"}>24-25</option>
            <option value={"26-27"}>26-27</option>
            <option value={"28-29"}>28-29</option>
            <option value={"30-31"}>30-31</option>
            <option value={"32-33"}>32-33</option>
            <option value={"34-35"}>34-35</option>
            <option value={"36이상"}>36이상</option>
          </select>
        }
      />
      <TextInputRow
        left={<div className="">신발 사이즈</div>}
        right={
          <select
            className={
              "tw-border-primary tw-border-[1px] tw-w-[300px]  tw-p-2 tw-rounded"
            }
            value={input?.shoe_size}
            onChange={(e) => handleChange("shoe_size", e.target.value)}
          >
            <option value={""} disabled selected>
              선택해 주세요
            </option>
            <option value={"210"}>210</option>
            <option value={"215"}>215</option>
            <option value={"220"}>220</option>
            <option value={"225"}>225</option>
            <option value={"230"}>230</option>
            <option value={"235"}>235</option>
            <option value={"240"}>240</option>
            <option value={"245"}>245</option>
            <option value={"250"}>250</option>
            <option value={"255"}>255</option>
            <option value={"260"}>260</option>
            <option value={"265"}>265</option>
            <option value={"270"}>270</option>
            <option value={"275"}>275</option>
            <option value={"280"}>280</option>
            <option value={"285"}>285</option>
            <option value={"290"}>290</option>
            <option value={"295"}>295</option>
            <option value={"300"}>300</option>
            <option value={"305이상"}>305이상</option>
          </select>
        }
      />
      <TextInputRow
        left={<div className="">키</div>}
        right={
          <select
            className={
              "tw-border-primary tw-border-[1px] tw-w-[300px]  tw-p-2 tw-rounded"
            }
            value={input?.height}
            onChange={(e) => handleChange("height", e.target.value)}
          >
            <option value={""} disabled selected>
              선택해 주세요
            </option>
            <option value={"230"}>140~150</option>
            <option value={"235"}>150~160</option>
            <option value={"240"}>160~170</option>
            <option value={"245"}>170~180</option>
            <option value={"250"}>180~190</option>
            <option value={"255"}>190~200</option>
            <option value={"305이상"}>200이상</option>
          </select>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold tw-mt-5">피부 정보</div>}
        right={<></>}
      />
      <TextInputRow
        left={<div className="">피부타입</div>}
        right={
          <select
            className={
              "tw-border-primary tw-border-[1px] tw-w-[300px] tw-p-2 tw-rounded"
            }
            value={input?.skin_type}
            onChange={(e) => handleChange("skin_type", e.target.value)}
          >
            <option value={""} disabled selected>
              선택해 주세요
            </option>
            <option value={"지성"}>지성</option>
            <option value={"건성"}>건성</option>
            <option value={"중성"}>중성</option>
            <option value={"복합성"}>복합성</option>
            <option value={"민감성"}>민감성</option>
            <option value={"트러블"}>트러블</option>
            <option value={"아토피"}>아토피</option>
          </select>
        }
      />
      <TextInputRow
        left={<div className="tw-font-bold tw-mt-5">라이프 정보</div>}
        right={<></>}
      />
      <TextInputRow
        left={<div className="">결혼 여부</div>}
        right={
          <div className={"tw-flex tw-gap-10"}>
            <label>
              <input
                type="radio"
                name={"marital_status"}
                checked={input?.marital_status === 0}
                onChange={() => handleChange("marital_status", 0)}
              />
              미혼
            </label>
            <label>
              <input
                type="radio"
                name={"marital_status"}
                checked={input?.marital_status === 1}
                onChange={() => handleChange("marital_status", 1)}
              />
              기혼
            </label>
          </div>
        }
      />
      <TextInputRow
        left={<div className="">자녀 유무</div>}
        right={
          <div className={"tw-flex tw-gap-10"}>
            <label>
              <input
                type="radio"
                name={"having_child"}
                checked={input?.having_child === 0}
                onChange={() => handleChange("having_child", 0)}
              />
              없음
            </label>
            <label>
              <input
                type="radio"
                name={"having_child"}
                checked={input?.having_child === 1}
                onChange={() => handleChange("having_child", 1)}
              />
              있음
            </label>
          </div>
        }
      />
      <TextInputRow
        left={<div className="">직업</div>}
        right={
          <select
            className={
              "tw-border-primary tw-border-[1px] tw-w-[300px] tw-p-2 tw-rounded"
            }
            value={input?.job}
            onChange={(e) => handleChange("job", e.target.value)}
          >
            <option value={""} disabled selected>
              선택해 주세요
            </option>
            <option value={"학생"}>학생</option>
            <option value={"직장인"}>직장인</option>
            <option value={"주부"}>주부</option>
            <option value={"자영업"}>자영업</option>
            <option value={"기타"}>기타</option>
          </select>
        }
      />
      <TextInputRow
        left={<div className="">반려동물 유무</div>}
        right={
          <div>
            <select
              className={
                "tw-border-primary tw-border-[1px] tw-w-[300px] tw-p-2 tw-rounded"
              }
              value={
                input?.companion_animal !== "강아지" &&
                input?.companion_animal !== "고양이" &&
                input?.companion_animal !== "없음"
                  ? "기타"
                  : input?.companion_animal
              }
              onChange={(e) => handleChange("companion_animal", e.target.value)}
            >
              <option value={""} disabled selected>
                선택해 주세요
              </option>
              <option value={"없음"}>없음</option>
              <option value={"강아지"}>강아지</option>
              <option value={"고양이"}>고양이</option>
              <option value={"기타"}>기타</option>
            </select>
            <div>
              {input?.companion_animal !== "강아지" &&
                input?.companion_animal !== "고양이" &&
                input?.companion_animal !== "없음" && (
                  <input
                    type="text"
                    className={
                      "tw-border-primary tw-border-[1px] tw-w-[300px] tw-p-2 tw-rounded tw-mt-1"
                    }
                    placeholder={"종류를 입력해주세요"}
                    maxLength={20}
                    value={input?.companion_animal}
                    onChange={(e) =>
                      handleChange("companion_animal", e.target.value)
                    }
                  />
                )}
            </div>
          </div>
        }
      />
      <Row>
        <div className={"!tw-w-[300px] tw-mx-auto !tw-my-10"}>
          {/*   onClick={handleSaveUrlsAndAditionalInfos} s*/}
          <Button text={"저장하기"} onClick={handleSaveUserOtherInfo} />
        </div>
      </Row>
      <Row>
        <div>
          <button
            className={
              "laon-btn !tw-bg-red-300 !tw-w-[280px] hover:!tw-bg-red-500 !tw-m-auto tw-block"
            }
            onClick={handleRemoveUser}
          >
            회원탈퇴
          </button>
        </div>
      </Row>
      {show && (
        <AddressModal
          show={show}
          setShow={setShow}
          address={address}
          user_seq={user?.user_seq!}
          setAddress={setAddress}
          setSelectedAdd={setSelectedAdd}
          selectedAdd={selectedAdd}
        />
      )}
    </div>
  );
};

export default MyPageInfo;
