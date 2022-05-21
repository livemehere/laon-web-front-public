import React, { useEffect } from "react";
import BlogBadge from "../common/badges/blogBadge";
import CheckLabel from "../common/checkLabel";
import { useRouter } from "next/router";
import { userState, UserType } from "../../recoil/atoms/userAtom";
import AxiosManager from "../../util/axiosManager";
import { ApplyType } from "./apply";
import { AddressType } from "../../recoil/atoms/addressAtom";
import { CampaignType } from "../../recoil/atoms/campaign";
import dayjs from "dayjs";
import { useRecoilValue } from "recoil";

interface Props {
  input: ApplyType;
  handleChange: (key: string, value: any) => void;
  selectedAddr: AddressType | undefined;
  campaign: CampaignType;
}

const ApplySideBox: React.FC<Props> = ({
  input,
  handleChange,
  selectedAddr,
  campaign,
}) => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  // 캠페인 신청
  const handleApply = async () => {
    if (user === null) {
      alert("로그인이 필요한 서비스입니다.");
      return router.push("/signin");
    }
    if (
      !selectedAddr ||
      !user.gender ||
      !user.blog ||
      !user.birth ||
      !user.email ||
      !user.name
    ) {
      return alert(
        "필수입력사항이 없습니다. 마이페이지에서 정보를 입력해주세요"
      );
    }

    if (input.acquaint_content === 1 && input.face_exposure === 1) {
      const result = await AxiosManager.post("/campaigns/apply", {
        campaign_seq: router.query.id,
        user_seq: input.user_seq,
        acquaint_content: input.acquaint_content,
        select_reward: "", // 2차에 추가 항목
        face_exposure: input.face_exposure,
        expose: input.expose,
        joint_blog: input.joint_blog, // 2차에 추가 항목
        camera_code: input.camera_code, // 2차에 추가 항목
        address: selectedAddr?.address,
        receiver: selectedAddr?.receiver,
        receiver_phonenumber: selectedAddr?.phonenumber,
        other_answers: input.other_answers,
      });

      if (result.status === 200) {
        alert("신청이 완료되었습니다.");
        router.push("/");
      } else {
        alert("이미 신청한 캠페인이거나, 필수항목을 채워주세요");
      }
    } else {
      alert("동의항목을 체크해주세요");
    }
  };

  useEffect(() => {
    console.log(input);
  }, [input]);

  return (
    <div className={"tw-flex-2 tw-mt-[200px]"}>
      <div className={"tw-border-b-[1px] tw-border-gray-200 tw-pb-5"}>
        <h5>{campaign.title}</h5>
        <p>{campaign.reward}</p>
        <BlogBadge />
      </div>
      <div className={"tw-border-b-[1px] tw-border-gray-200 tw-pb-5 tw-mt-5"}>
        <p className={"tw-mb-1"}>
          <span className={"tw-font-bold"}>캠페인 신청기간</span>{" "}
          {dayjs(campaign.recruit_start_date).format("MM.DD")} ~{" "}
          {dayjs(campaign.recruit_end_date).format("MM.DD")}
        </p>
        <p className={"tw-mb-1"}>
          <span className={"tw-font-bold"}>인플루언서 발표</span>{" "}
          {dayjs(campaign.reviewer_announcement_date).format("MM.DD")}
        </p>
        <p className={"tw-mb-1"}>
          <span className={"tw-font-bold"}>컨텐츠 등록기간</span>{" "}
          {dayjs(campaign.review_start_date).format("MM.DD")} ~{" "}
          {dayjs(campaign.review_end_date).format("MM.DD")}
        </p>
        <p className={"tw-mb-1"}>
          <span className={"tw-font-bold"}>켐페인 결과발표</span>{" "}
          {dayjs(campaign.campaign_end_date).format("MM.DD")}
        </p>
      </div>
      <div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={input?.face_exposure === 1}
              onChange={(e) =>
                handleChange("face_exposure", e.target.checked ? 1 : 0)
              }
            />
            <span className={`tw-text-gray-500 tw-pl-2`}>
              초상권 활용에 동의합니다.
            </span>
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={input?.acquaint_content === 1}
              onChange={(e) =>
                handleChange("acquaint_content", e.target.checked ? 1 : 0)
              }
            />
            <span className={`tw-text-gray-500 tw-pl-2`}>
              캠페인 유의사항 및 제 3자 제공에 모두 동의합니다.
            </span>
          </label>
        </div>
      </div>
      <div>
        <select
          className={
            "tw-border-primary tw-border-[1px] tw-w-[100%] tw-my-3 tw-py-2 tw-rounded"
          }
          value={input.camera_code}
          onChange={(e) => handleChange("camera_code", e.target.value)}
        >
          <option value={""} disabled selected>
            카메라 기종 선택
          </option>
          <option value={"CMC0001"}>휴대폰 카메라</option>
          <option value={"CMC0002"}>미러리스</option>
          <option value={"CMC0003"}>DSLR</option>
          <option value={"CMC0004"}>기타</option>
        </select>
        <div>
          <div className={"tw-font-bold tw-my-3"}>포스팅 얼굴노출</div>
          <div className={"tw-flex tw-gap-10"}>
            <label>
              <input
                type="radio"
                name={"face_expose"}
                checked={input.expose === 1}
                onChange={() => handleChange("expose", 1)}
              />
              비노출
            </label>
            <label>
              <input
                type="radio"
                name={"face_expose"}
                checked={input.expose === 0}
                onChange={() => handleChange("expose", 0)}
              />
              노출
            </label>
          </div>
        </div>
        <div>
          <div className={"tw-font-bold tw-my-3"}>공동 블로그 유무</div>
          <div className={"tw-flex tw-gap-10"}>
            <label>
              <input
                type="radio"
                name={"joint_blog"}
                checked={input.joint_blog === 0}
                onChange={() => handleChange("joint_blog", 0)}
              />
              1인(본인)
            </label>
            <label>
              <input
                type="radio"
                name={"joint_blog"}
                checked={input.joint_blog === 1}
                onChange={() => handleChange("joint_blog", 1)}
              />
              2인 이상
            </label>
          </div>
        </div>
      </div>
      <button
        className={"tw-bg-primary tw-w-[100%] tw-py-3 tw-text-white tw-mt-4"}
        onClick={handleApply}
      >
        리뷰 신청하기
      </button>
    </div>
  );
};

export default ApplySideBox;
