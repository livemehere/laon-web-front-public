import React, { useEffect, useState } from "react";
import TextInputRow from "../common/textInputRow";
import Input from "../common/input";
import RadioInput from "../common/radioInput";
import URLForm from "../common/urlForm";
import Table from "../mypage/table";
import ApplySideBox from "./applySideBox";
import useInput from "../../hooks/useInput";
import { Col, Row } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { userState, UserType } from "../../recoil/atoms/userAtom";
import { addressState } from "../../recoil/atoms/addressAtom";
import { GetServerSideProps } from "next";
import AxiosManager from "../../util/axiosManager";
import { CampaignType } from "../../recoil/atoms/campaign";

interface Props {
  campaign: CampaignType;
}

export interface ApplyType {
  campaign_seq: number;
  user_seq: number;
  acquaint_content: number;
  select_reward: string;
  face_exposure: number;
  expose: number;
  joint_blog: number;
  camera_code: string;
  address: string;
  receiver: string;
  receiver_phonenumber: string;
  other_answers: string;
}

const ProductApplyWrap: React.FC<Props> = ({ campaign }) => {
  const [user, setUser] = useRecoilState(userState);
  const [address, setAddress] = useRecoilState(addressState);

  const { input, handleChange } = useInput<ApplyType>({
    campaign_seq: campaign.campaign_seq,
    user_seq: user?.user_seq || 0,
    acquaint_content: 0,
    select_reward: "",
    face_exposure: 0,
    expose: 0,
    joint_blog: 0, // 공동 블로그인지 체크(이건 그냥 신청할때만 하면 될듯)
    camera_code: "", // 2차에 개발 예정
    address: "",
    receiver: "",
    receiver_phonenumber: "",
    other_answers: "",
  });

  const [selectedAddr, setSelectedAddr] = useState(0);

  // 기본배송지로 세팅
  useEffect(() => {
    const selected = address?.filter((a) => a.is_default === 1)[0];
    if (selected?.address_seq) {
      setSelectedAddr(selected.address_seq);
    }
  }, [address]);

  const handleSelectAddress = (address_seq: number) => {
    const selected = address?.filter((a) => a.address_seq === address_seq)[0];
    if (selected?.address_seq) {
      setSelectedAddr(selected.address_seq);
    }
  };
  useEffect(() => {
    console.log(input);
  }, [input]);

  return (
    <div className={"tw-flex tw-gap-10"}>
      <div className={"tw-mb-[200px] tw-flex-1"}>
        <h2 className={"tw-my-10"}>캠페인 신청하기</h2>
        <table className={"tw-table-auto tw-w-[100%]  product-info-table"}>
          <tr>
            <th className={""}>바로가기링크</th>
            <td>
              <a
                href="https://naver.com"
                className={"!tw-text-primary tw-text-bold tw-text-lg"}
              >
                {campaign.siteURL}
              </a>
            </td>
          </tr>
          <tr>
            <th className={""}>캠페인 주요 정보</th>
            <td>
              <div className={""}>
                {/* 제목인듯? */}
                <p>{campaign.title}</p>
              </div>
            </td>
          </tr>
          <tr>
            <th>회원 기본정보</th>
            <td>
              <div>
                <p className={"!tw-mb-5"}>회원 기본정보를 입력해주세요</p>
                <TextInputRow
                  left={<div className="">이름</div>}
                  right={
                    <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
                      <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={user?.name}
                        disabled
                        className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                      />
                    </div>
                  }
                />
                <TextInputRow
                  left={<div className="">성별</div>}
                  right={
                    <div className="tw-flex tw-gap-8">
                      <div>
                        <label>
                          <input
                            type="radio"
                            value="M"
                            name="gender"
                            disabled
                            className="tw-mr-1"
                            checked={
                              user?.gender === "M" || user?.gender === "m"
                            }
                          />
                          <span>남자</span>
                        </label>
                      </div>
                      <div>
                        <label>
                          <input
                            type="radio"
                            value="F"
                            name="gender"
                            disabled
                            className="tw-mr-1"
                            checked={
                              user?.gender === "F" || user?.gender === "f"
                            }
                          />
                          <span>여자</span>
                        </label>
                      </div>
                    </div>
                  }
                />
                <TextInputRow
                  left={<div className="">출생년도</div>}
                  right={
                    <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
                      <input
                        type="number"
                        placeholder="출생년도를 입력하세요"
                        value={user?.birth}
                        disabled
                        className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                      />
                    </div>
                  }
                />
                <TextInputRow
                  left={<div className="">아이디(이메일)</div>}
                  right={
                    <div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
                      <input
                        type="text"
                        placeholder="laondeas@naver.com"
                        disabled
                        value={user?.email}
                        className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                      />
                    </div>
                  }
                />
              </div>
            </td>
          </tr>
          <tr>
            <th>블로그 등록</th>
            <div className={"tw-pl-5 tw-py-10"}>
              <div>
                <div className={"tw-flex tw-items-center tw-gap-1"}>
                  <span>https://blog.naver.com/</span>
                  <input
                    type="text"
                    placeholder="url"
                    value={user?.blog}
                    disabled
                    className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
                  />
                </div>
                <div className={"tw-mt-3"}>
                  <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                    등록 및 변경하고자 하는 블로그 URL 혹은 RSS를 입력해 주세요.
                  </p>
                  <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                    1개 이상의 포스팅이 외부에 검색가능한 상태일때에만 블로그
                    등록이 가능합니다.
                  </p>
                  <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                    모바일 URL은 지원하지 않으니 PC에서 확인하신URL을
                    등록해주세요.
                  </p>
                  <p className={"tw-text-gray-800 tw-mb-0 tw-text-[.85em]"}>
                    인플루언서 등록에 어려움이 있으시다면 1:1문의에 남겨주세요.
                  </p>
                </div>
              </div>
            </div>
          </tr>
          <tr>
            <th>신청 정보 입력</th>
            <td>
              <div className={""}>
                <Row
                  className={
                    "tw-bg-gray-100 tw-border-y-[1px] tw-border-gray-300"
                  }
                >
                  <Col className={"tw-text-center tw-p-1"}>배송지</Col>
                  <Col className={"tw-text-center tw-p-1"}>받는이</Col>
                  <Col className={"tw-text-center tw-p-1"}>주소/휴대폰번호</Col>
                </Row>
                {/*  주소록 배열 돌기 */}
                {address &&
                  address.map((a) => (
                    <Row
                      key={a.address_seq}
                      className={`tw-cursor-pointer ${
                        selectedAddr === a.address_seq && "!tw-bg-gray-200"
                      }`}
                      onClick={() => handleSelectAddress(a.address_seq)}
                    >
                      <Col className={"tw-text-center tw-p-1"}>
                        {a.name} {a.is_default === 1 && "(기본배송지)"}
                      </Col>
                      <Col className={"tw-text-center tw-p-1"}>
                        {a.receiver}
                      </Col>
                      <Col className={"tw-text-center tw-p-1 tw-text-xs"}>
                        {a.address}
                        <br />
                        <span className={"tw-text-gray-500"}>
                          {a.phonenumber}
                        </span>
                      </Col>
                    </Row>
                  ))}
              </div>
            </td>
          </tr>
          <tr>
            <th className={""}>기타 작성란</th>
            <td>
              <div className={""}>
                <textarea
                  placeholder="제공받을 보상과 기타사항을 작성해주세요"
                  value={input?.other_answers}
                  onChange={(e) =>
                    handleChange("other_answers", e.target.value)
                  }
                  className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 tw-min-h-[200px]"
                />
              </div>
            </td>
          </tr>
        </table>
      </div>
      {/* 인풋값, 선택된 주소 를 신청 박스로 넘김 */}
      <ApplySideBox
        input={input}
        handleChange={handleChange}
        selectedAddr={address?.filter((a) => a.address_seq === selectedAddr)[0]}
        campaign={campaign}
      />
    </div>
  );
};

export default ProductApplyWrap;
