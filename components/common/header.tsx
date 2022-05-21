import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Image from "next/image";
import TextLinkButton from "./TextLinkButton";
import Layout from "./layout";
import NavButton from "./navButton";
import Link from "next/link";
import { userState } from "../../recoil/atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRouter } from "next/router";
import useLogout from "../../hooks/useLogout";
import { filterState, FilterType } from "../../recoil/atoms/filter";
import useInput from "../../hooks/useInput";
import { campaignListState, CampaignType } from "../../recoil/atoms/campaign";
import { filterdCampaignListState } from "../../recoil/atoms/filterdCampaign";
import FilterRow from "./FilterRow";
import { areaDetailList } from "../../util/areaDetailList";
import { useForm } from "react-hook-form";
import { filterIsOpenState } from "../../recoil/atoms/filterIsOpenState";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [user, setUser] = useRecoilState(userState);
  const router = useRouter();
  const handleLogout = useLogout();

  const [camp, setCamp] = useRecoilState(campaignListState); // 전체 원본 캠페인
  const [fCamp, setFCamp] = useRecoilState(filterdCampaignListState); // 필터링할때사용할 캠페인 복사본 recoil
  const [filter, setFilter] = useRecoilState(filterState); // filtering 조건이 들어간 recoil
  const filterInput = useInput<FilterType>(filter); // filter을 업데이트하기위한 state
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [headerCategory, setHeaderCategory] = useState("전체");
  const [search, setSearch] = useState("");
  const [filterIsOpen, setFilterIsPoen] = useRecoilState(filterIsOpenState);
  const [selectedMenu, setSelectedMenu] = useState("");

  useEffect(() => {
    setFilterIsPoen(false);
  }, []);

  const handleSearch = () => {
    const finalCamp: CampaignType[] = [];
    const regx = new RegExp(search);
    [...fCamp].forEach((camp) => {
      if (
        regx.test(camp.title) ||
        regx.test(camp.keyword) ||
        regx.test(camp.product) ||
        regx.test(camp.reward)
      ) {
        finalCamp.push(camp);
      }
    });
    setFCamp(finalCamp);
  };

  // 헤더가 새로 갱신되면 초기화
  useEffect(() => {
    filterInput.setInput({
      channel: [],
      product: [],
      area: [],
      detail: [],
      accrual_point: [],
      sort: ["최신순"],
    });
  }, [filterIsOpen]);

  //input 이랑 recoil 이랑 바인딩
  useEffect(() => {
    let tempCampaign: CampaignType[] = [];

    if (headerCategory === "전체") {
      tempCampaign = [...camp];
    } else if (headerCategory === "방문형") {
      tempCampaign = [...camp].filter((c) => c.category === "방문형");
    } else if (headerCategory === "배송형") {
      tempCampaign = [...camp].filter((c) => c.category === "배송형");
    } else if (headerCategory === "기자단") {
      tempCampaign = [...camp].filter((c) => c.category === "기자단");
    } else if (headerCategory === "프리미엄") {
      if (user?.is_premium) {
        // setIsPremium(true);
        tempCampaign = [...camp].filter((c) => c.is_premium === 1);
      } else {
        router.push("/premium");
      }
    }

    const selected = filterInput.input.area[0];

    // 지역 선택하면 상세지역 state 업데이트
    if (selected) {
      setSelectedArea(selected);
    }
    //  TODO: 여기서 캠페인 복사본 필터링 하기 (accrual_point)는 별개로
    let finalFilterdCampaignList: any[] = [];

    tempCampaign.forEach((camp) => {
      const channel = camp["channel"]; // 채널
      const area = camp["area"].split(" ")[0]; // 지역
      const detail = camp["area"].split(" ")[1]; // 지역
      const product = camp["product"]; // 카테고리
      const accrual_point = camp["accrual_point"]; // 포인트

      const Fchannel = filterInput.input.channel;
      const Farea = filterInput.input.area;
      const Fdetail = filterInput.input.detail;
      const Fproduct = filterInput.input.product;
      const Faccrual_point = filterInput.input.accrual_point;
      let totalResult;

      // 포인트
      let pointResult = false;
      if (Faccrual_point.includes("전체")) {
        pointResult = true;
      } else if (Faccrual_point.includes("5천 이하")) {
        pointResult = accrual_point <= 5000;
      } else if (Faccrual_point.includes("5천 이상")) {
        pointResult = accrual_point >= 5000;
      } else if (Faccrual_point.includes("1만 이상")) {
        pointResult = accrual_point >= 10000;
      } else if (Faccrual_point.includes("2만 이상")) {
        pointResult = accrual_point >= 20000;
      } else if (Faccrual_point.includes("5만 이상")) {
        pointResult = accrual_point >= 50000;
      }
      // 지역을 공백으로 잘랐을떄, detail이 있다면 검사
      if (detail) {
        totalResult =
          (Farea.includes(area) || Farea.length === 0) &&
          (Fchannel.includes(channel) || Fchannel.length === 0) &&
          (Fproduct.includes(product) || Fproduct.length === 0) &&
          (pointResult || Faccrual_point.length === 0) &&
          (Fdetail.includes(detail) || Fdetail.length === 0);
      } else {
        totalResult =
          (Farea.includes(area) || Farea.length === 0) &&
          (Fchannel.includes(channel) || Fchannel.length === 0) &&
          (Fproduct.includes(product) || Fproduct.length === 0) &&
          (pointResult || Faccrual_point.length === 0);
      }
      if (totalResult) finalFilterdCampaignList.push(camp);
    });
    setFCamp(finalFilterdCampaignList);
  }, [filterInput.input, headerCategory]);
  // 필터링이나 헤더카테고리가 바뀔때 필터링 수행

  // 캠페인 원본이 저장된다면 필터링할 캠페인을 동일하게 세팅
  useEffect(() => {
    setFCamp(camp);
  }, [camp]);

  // 필터링은 전체 선택했을때만 등장
  const handleFiltering = () => {
    const isHome = router.pathname === "/";

    // home이 아니라면 홈으로 이동
    if (!isHome) {
      router.replace("/");
    } else {
      handleFilterOneCategory("전체");
    }
    // 누르면 무조건 나옴 없애려면 다른거 누르기

    setFilterIsPoen(true);
  };

  const handleFilterOneCategory = (type: string) => {
    // TODO: 필터링 수행하고 이동
    const isHome = router.pathname === "/";
    // home이 아니라면 홈으로 이동
    if (!isHome) router.push("/");
    setSelectedMenu(type);
    setHeaderCategory(type);
    if (router.pathname === "/premium") return;
    setFilterIsPoen(true);
  };

  return (
    <>
      <Layout>
        <Row className="tw-my-5 tw-pt-2">
          <div className="tw-divide-x-[1px] tw-flex tw-justify-end">
            {user ? (
              <>
                {user.is_admin === 1 ? (
                  <TextLinkButton url={"/admin"}>관리자 페이지</TextLinkButton>
                ) : (
                  <TextLinkButton url={"/mypage"}>마이페이지</TextLinkButton>
                )}
                <div
                  className={`tw-px-2 tw-text-gray-400 hover:tw-cursor-pointer`}
                  onClick={handleLogout}
                >
                  로그아웃
                </div>
              </>
            ) : (
              <>
                <TextLinkButton url={"/signin"}>로그인</TextLinkButton>
                <TextLinkButton url={"/signup"}>회원가입</TextLinkButton>
              </>
            )}
            <TextLinkButton
              onClick={() => {
                if (!user?.user_seq) return alert("로그인 후 이용해주세요");
                router.push("/mypage/query");
              }}
            >
              고객센터
            </TextLinkButton>
          </div>
        </Row>
        <Row className="tw-my-5">
          <Col>
            <div
              className="tw-flex tw-justify-start"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              <Image
                src="/images/logo.png"
                alt="logo"
                width={300}
                height={45}
                className="tw-cursor-pointer"
              />
            </div>
          </Col>
          <Col className="tw-flex tw-justify-end">
            <div className="tw-flex tw-p-[5px] laon-colorful-bg tw-w-[60%]">
              <div className="tw-flex-1 tw-m-auto">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="tw-w-[100%] tw-p-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <div className="tw-grid tw-place-items-center tw-p-1 tw-cursor-pointer">
                <Image
                  src="/images/basicIcons/search.svg"
                  width={23}
                  height={23}
                  alt="searchicon"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Layout>
      <Layout className="laon-colorful-bg">
        <Row>
          <Col className="tw-grid tw-place-items-center tw-p-4">
            <NavButton
              callback={handleFiltering}
              selectedMenu={selectedMenu}
              menuName={"전체"}
            >
              전체
            </NavButton>
          </Col>
          <Col className="tw-grid tw-place-items-center tw-p-4">
            <NavButton
              selectedMenu={selectedMenu}
              menuName={"방문형"}
              callback={() => handleFilterOneCategory("방문형")}
            >
              방문형
            </NavButton>
          </Col>
          <Col className="tw-grid tw-place-items-center tw-p-4">
            <NavButton
              selectedMenu={selectedMenu}
              menuName={"배송형"}
              callback={() => handleFilterOneCategory("배송형")}
            >
              배송형
            </NavButton>
          </Col>
          <Col className="tw-grid tw-place-items-center tw-p-4">
            <NavButton
              selectedMenu={selectedMenu}
              menuName={"기자단"}
              callback={() => handleFilterOneCategory("기자단")}
            >
              기자단
            </NavButton>
          </Col>
          <Col className="tw-grid tw-place-items-center tw-p-4">
            <NavButton
              selectedMenu={selectedMenu}
              menuName={"프리미엄"}
              callback={() => handleFilterOneCategory("프리미엄")}
            >
              프리미엄
            </NavButton>
          </Col>
        </Row>
      </Layout>
      {filterIsOpen && (
        <Layout>
          <div
            className={
              "tw-divide-y-2 tw-border-b-2 tw-pb-3 tw-border-gray-200 tw-mb-2"
            }
          >
            <FilterRow
              title={"채널"}
              category={"channel"}
              items={["전체", "블로그", "인스타그램", "유튜브", "인플루언서"]}
              filterInput={filterInput}
              setFilter-={setFilter}
            />

            <FilterRow
              title={"카테고리"}
              category={"product"}
              items={[
                "전체",
                "맛집",
                "여행/숙박",
                "뷰티",
                "문화/생활",
                "식품",
                "디지털",
                "패션",
                "유아동",
                "도서",
                "반려동물",
              ]}
              filterInput={filterInput}
              setFilter-={setFilter}
            />
            <FilterRow
              title={"지역"}
              category={"area"}
              items={[
                "전체",
                "서울",
                "경기",
                "부산",
                "인천",
                "대구",
                "울산",
                "광주",
                "경북",
                "경남",
                "전북",
                "전남",
                "충북",
                "충남",
                "세종",
                "제주",
              ]}
              filterInput={filterInput}
              setFilter-={setFilter}
            />
            {filterInput.input["area"].length === 1 && (
              <div className={"tw-bg-gray-100"}>
                <FilterRow
                  title={"지역상세"}
                  category={"detail"}
                  items={
                    areaDetailList[selectedArea]
                      ? areaDetailList[selectedArea]
                      : []
                  }
                  filterInput={filterInput}
                  setFilter-={setFilter}
                />
              </div>
            )}

            <FilterRow
              title={"포인트"}
              category={"accrual_point"}
              items={[
                "전체",
                "5천 이하",
                "5천 이상",
                "1만 이상",
                "2만 이상",
                "5만 이상",
              ]}
              filterInput={filterInput}
              setFilter-={setFilter}
            />
          </div>
        </Layout>
      )}
    </>
  );
};

export default Header;
