import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { CampaignType } from "../../recoil/atoms/campaign";
import AxiosManager from "../../util/axiosManager";

interface Props {
  campaign: CampaignType;
}

const InfoTab: React.FC<Props> = ({ campaign }) => {
  const [geo, setGeo] = useState<{ x: number; y: number }>();
  const mapRef = useRef<any>();

  const getGeoFromAddress = async () => {
    const r = await axios.get("/api/getGeo", {
      params: {
        query: campaign.address,
      },
    });
    if (r.status === 200) {
      setGeo(r.data);
    }
  };

  useEffect(() => {
    getGeoFromAddress();
  }, []);

  useEffect(() => {
    const { naver } = window;
    mapRef.current = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(Number(geo?.y), Number(geo?.x)),
      zoom: 18,
    });

    new naver.maps.Marker({
      position: new naver.maps.LatLng(Number(geo?.y), Number(geo?.x)),
      map: mapRef.current,
    });
  }, [geo]);

  return (
    <div>
      <div>
        <div id="map" style={{ width: "100%", height: "400px" }} />
      </div>
      <table className={"tw-table-auto tw-w-[100%]  product-info-table"}>
        <tr>
          <th className={""}>제공내역</th>
          <td>{campaign.reward}</td>
        </tr>
        <tr>
          <th className={""}>검색키워드</th>
          <td>
            <div className={"tw-mb-2"}>
              <p>{campaign.keyword}</p>
            </div>
            <div className={"tw-text-gray-500"}>
              <p>
                - 안내해 드린 검색키워드를 제목, 본문, #태그에 꼭 넣어주세요.{" "}
              </p>
              <p>
                - 단어 및 띄어쓰기를 정확하게 사용해야 하며, 지켜지지 않으면
                수정요청이 있을 수 있습니다.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <th>사이트 URL</th>
          <td>
            <a
              href={campaign.siteURL}
              target={"_blank"}
              rel="noopener noreferrer"
              className={"!tw-text-primary !tw-font-semibold"}
            >
              {campaign.siteURL}
            </a>
          </td>
        </tr>
        <tr>
          <th>캠페인 안내</th>
          <td>
            <ul className={"tw-pl-0 "}>
              {/* FIXME: 여기가 아마 쉼표로 구분해서 배열로만들고, li 뿌려야 될 수 도있음. */}
              {campaign.campaign_guide.split("\n").map((c) => (
                <>
                  {c}
                  <br />
                </>
              ))}
              <li>
                리뷰어 미션이 지켜지지 않을 경우 별도의 수정 요청이 있을 수
                있습니다
              </li>
              <li>제공내역의 세부 사항은 하단의 내용 참고 부탁드립니다</li>
              <div />
            </ul>
          </td>
        </tr>
        <tr>
          <th>리뷰어 미션</th>
          <td>
            {campaign.misson.split("\n").map((c) => (
              <>
                {c}
                <br />
              </>
            ))}
          </td>
        </tr>
        <tr>
          <th>추가 안내사항</th>
          <td>
            <ul className={"tw-pl-0"}>
              <li>
                - 제공받은 제품또는 서비스는 타인에게 양도 및 판매, 교환을 절대
                허용하지 않으며, 적발 시 제품 가격 환불 및 캠페인 참여
                제한됩니다.
              </li>
              <li>
                - 콘텐츠 등록 기간 내 콘텐츠 미등록 시 서비스 이용료 및 제품
                가격에 대하여 비용 청구됩니다.
              </li>
              <li>
                - 선정 후 단순 변심에 의한 제공내역 옵션 및 배송지 변경은
                어렵습니다.
              </li>
              <li>
                - 안내된 제공 내역과 다르거나, 별도 공지 없이 7일 이상 배송되지
                않는 등 진행이 어려운 경우 1:1문의로 연락해 주세요.
              </li>
              <li>
                - 업체 측 요청에 따라 선정 인플루언서 수가 변경될 수 있습니다.
              </li>
              <li>
                - 콘텐츠 작성 시 선정 된 본 캠페인의 제품만으로 단독 촬영하여
                진행되어야 합니다.
              </li>

              <li>
                - 작성하신 콘텐츠는 6개월 유지해야 하며, 유지하지 않을 경우
                페널티가 부과됩니다.
              </li>
              <li>
                - 콘텐츠 작성이 완료되면, 블로그는 제공된 스폰서 배너를
                삽입하고, 인스타그램 등의 미디어 채널은 콘텐츠 본문에 반드시
                해시태그 문구가 삽입되어야 캠페인 참여로 인정됩니다.
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default InfoTab;
