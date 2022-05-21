import React, { ChangeEvent } from "react";

interface Props {
  title: string;
  category: string;
  items: any[];
  filterInput: any;
}

const FilterRow: React.FC<Props> = ({
  title,
  category,
  items,
  filterInput,
}) => {
  const updateFilterInput = (e: ChangeEvent<HTMLInputElement>) => {
    const item = e.target.value; // 체크된 라벨 이름
    const checked = e.target.checked; // 체크여부
    let itemList = [...filterInput.input[category]]; //현제 필터링 아이템 리스트들

    // 체크 상태에 따라서 추가, 삭제
    if (checked) {
      // 포인트는 그냥 하나만 선택하도록 처리
      if (category === "accrual_point") {
        itemList = [item];
      } else {
        itemList.push(item);
      }
    } else {
      itemList = itemList.filter((i) => i !== item);
    }

    // 전체 클릭하면 모두 선택
    if (item === "전체" && checked) {
      if (category === "accrual_point") {
        itemList = ["전체"];
      } else {
        itemList = items;
      }
    } else if (item === "전체" && !checked) {
      itemList = [];
    }
    // 지역을 선택할때마다 디테일은 초기화
    if (category === "area") {
      filterInput.setInput((prev: any) => ({ ...prev, detail: [] }));
    }

    // 필터링 업데이트
    filterInput.handleChange(category, itemList);
  };
  return (
    <div className={"tw-flex "}>
      <div className={"tw-w-[150px] tw-flex tw-justify-center tw-items-center"}>
        {title}
      </div>
      <div
        className={
          "tw-grid tw-grid-cols-[repeat(9,1fr)] tw-items tw-gap-x-5 tw-w-[100%]"
        }
      >
        {items.map((i, idx) => (
          <div key={idx} className={"tw-py-3"}>
            <label>
              <input
                type="checkbox"
                value={i}
                checked={
                  filterInput.input[category] &&
                  filterInput.input[category].includes(i)
                }
                onChange={(e) => updateFilterInput(e)}
                className={"tw-mr-1"}
              />
              <span>{i}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterRow;
