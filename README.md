# 라온디어스 웹 프론트엔드 라이브러리 버전

## 커스텀 컴포넌트 치트시트

### 개행문자 대로 줄바꿈

```tsx
{n.content.split("\n").map((c) => (
          <>
            {c}
            <br />
          </>
        ))}
```

### 제목 + 내용 + 버튼 마크업

```tsx
<h2 className={"tw-mt-10"}>공지사항 작성</h2>
 <form onSubmit={handleSubmit(onSubmit, onError)} >
    <input
        type="text"
        placeholder="제목"
        {...register("title", {
            required: {
                value: true,
                message: "필수 입력값입니다",
            },
        })}
        className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300 tw-mb-2"
    />
    <textarea
        {...register("content", {
            required: {
                value: true,
                message: "필수 입력값입니다",
            },
        })}
        className={
            "tw-w-[100%] tw-border-black/20 tw-border-[1px] tw-min-h-[20rem] tw-mb-2"
        }
    />
    <button
        className={"tw-bg-primary tw-w-[100%] tw-py-2 tw-text-white"}
    >
        작성
    </button>
</form>
```

### react-hook-form

```tsx
  const {
    register,
    handleSubmit,
    formState: { errors },
} = useForm();
const onSubmit: SubmitHandler<any> = async (data) => console.log(data);
const onError: SubmitErrorHandler<any> = (errors) => console.log(errors);

useEffect(() => {
    console.log(errors);
}, [errors]);

<form onSubmit={handleSubmit(onSubmit, onError)}>
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
</form>
```

### 체크박스 

```tsx
const { input, handleChange } = useInput<UserType | null>(user);

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
```

### 일반 인풋

```tsx
 <input
  type="text"
  placeholder="아이디"
  value={input?.email}
  onChange={(e) => handleChange("email", e.target.value)}
  className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
/>
```

```tsx
<div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
    <input
        type="number"
        placeholder="출생년도를 입력하세요"
        value={input?.birth}
        onChange={(e) => handleChange("birth", e.target.value)}
        className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
    />
    {/* span 은 생략가능 (오른쪽 끝에 뭐 넣고싶을때 쓰기) */}
    <span className={`tw-absolute tw-right-[5px] tw-top-[50%] tw-translate-y-[-50%] tw-text-xs tw-text-gray-400`}>이름을 입력하세요</span>
</div>
```

### 인풋 버튼

```tsx
<div className={`tw-my-1 tw-relative !tw-max-w-[250px]`}>
  <input
    type="button"
    value="인증번호 요청"
    className="tw-w-[100%] tw-p-2 tw-border-[1px] tw-border-gray-300"
    onClick={() => alert("인증요청")}
  />
</div>
```

### 라디오 버튼

```tsx
<div className="tw-flex tw-gap-8">
    <div>
      <label>
        <input
          type="radio"
          value="m"
          name="gender"
          className="tw-mr-1"
          checked={input?.gender === "m"}
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
          checked={input?.gender === "f"}
          onChange={(e) => handleChange("gender", e.target.value)}
        />
        <span>여자</span>
      </label>
    </div>
</div>
```

## SSR 

```tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

```


## settings

- yarn create next-app --typescript
- bootstrap
- tailwind
- sass
- custom bootstrap scss 설정('styles/custom.scss')

## Custom Snippet

- rfcc : props interface를 포함한 tsx 컴포넌트

## 작업 시 틀어놓고 하면 좋은 doc 링크들

- [react bootstrap doc](https://react-bootstrap.netlify.app/layout/breakpoints/)
- [bootstrap doc](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
- [tailwind doc](https://tailwindcss.com/docs/installation)

## Tips

### 새로운 page 생성시 베이스

```js
return (
    <>
        <Head>
            <title>라온디어스 체험단 | 캠페인</title>
            <meta name="description" content="라온디어스 체험단입니다" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <>
            <Header />
            <Wrap>
            //    여기에 작성하세요
            </Wrap>
            <Footer />
        </>
    </>
);
```

### Image 태그

이미지태그를 사용할때 직접 select 할수가없어서 항상 부모태그를 만들어주어야한다.

Image 태그에는 layout='fill' 속성을 주고
부모에는 position:relative를 반드시 주어야한다.

**그리고서 부모의 width, height를 조절하면된다**

```tsx
<div className="tw-w-[100%] tw-h-[300px] tw-relative">
  <Image src="/images/banner.png" alt="banner" layout="fill" />
</div>
```

## tsx snippet

```tsx
import React from 'react';

interface Props{

}

const Table:React.FC<Props> = ({}:Props)=>{
    return(
        <div>table</div>
    );
}

export default Table;
```


## Custom Cumponents usage

### TabMenu

```tsx
const menuList = ["리뷰어", "광고주"];
const [selected, setSelected] = useState(menuList[0]);

const handleSelect = (title: string) => {
  setSelected(title);
};

<TabMemu selected={selected} menuList={menuList} handleClick={handleSelect} />;
```
