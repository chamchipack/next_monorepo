// "use client";
// import React, {
//   forwardRef,
//   useImperativeHandle,
//   useEffect,
//   useState,
// } from "react";
// import { DefaultType } from "@/config/type/DefaultType/type";
// import { Components as DynamicList } from "@/components/Dynamic";

// import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";

// import { Box, Button, Typography } from "@mui/material";
// import db from "@/api/module";
// import ClearIcon from "@mui/icons-material/Clear";

// const ResponsiveReactGridLayout = WidthProvider(Responsive);

// export interface PanelRef {
//   externalFunction: (widgets: Widget[]) => void;
//   onClickSaveLayout: () => void;
//   onClickReset: () => void;
// }

// const initialLayout: any = [{ w: 1, h: 1, x: 0, y: 0, i: "" }];
// type Widget = {
//   name: string;
//   id: string;
//   layout: {};
//   component: () => Promise<React.ComponentType<any>>;
// };

// type LayoutType = {
//   w: number;
//   h: number;
//   x: number;
//   y: number;
//   i: string;
// };

// const Panel = forwardRef(
//   (
//     {
//       dynamicInfo,
//       devMode = true,
//     }: { dynamicInfo: DefaultType["dynamic"]; devMode: boolean },
//     ref
//   ) => {
//     const [layout, setLayout] = useState([]);
//     const [Component, setComponent] = useState<Widget[]>([]);

//     const [width, setWidth] = useState(1200);
//     const [rowHeight, setRowHeight] = useState(window.innerHeight / 20);

//     useEffect(() => {
//       if (!devMode) {
//         const handleResize = () => {
//           setWidth(window.innerWidth);
//           setRowHeight(window.innerHeight / 20);
//         };

//         window.addEventListener("resize", handleResize);
//         handleResize(); // 초기 사이즈 설정을 위해 한번 호출

//         return () => {
//           window.removeEventListener("resize", handleResize);
//         };
//       }
//     }, []);

//     const setComponentsOnMnt = async () => {
//       const { layout = [] } = dynamicInfo;

//       if (!layout.length) return;

//       const render: Widget[] = layout.reduce(
//         (acc: Widget[], data: LayoutType) => {
//           const { i = "" } = data;
//           let good = null;
//           Object.values(DynamicList).forEach((o) => {
//             good = o.find(({ id = "" }) => id === i);
//             if (good) acc.push({ layout: { ...data }, ...good });
//           });
//           return acc;
//         },
//         []
//       );

//       onClickSetWidgets(render);
//     };

//     useEffect(() => {
//       setComponentsOnMnt();
//     }, []);

//     const uniqueFiltered = (results) => {
//       if (!results.length) return [];
//       return results.reduce((acc, current) => {
//         const isExist = acc.some((item) => item.id === current.id);

//         if (!isExist) acc.push(current);
//         return acc;
//       }, []);
//     };

//     const onClickSetWidgets = async (selectedWidgets: Widget[]) => {
//       const promises = selectedWidgets.map((widget) =>
//         widget.component().then((comp) => ({
//           id: widget.id,
//           component: comp.default,
//           layout: widget.layout,
//           name: widget.name,
//         }))
//       );

//       const results: Widget[] = await Promise.all(promises);
//       const combined = [...results, ...Component];
//       const unique = uniqueFiltered(combined);
//       // if (Component.length)
//       // setComponent((prevComponents) => [...prevComponents, ...results]);
//       // else
//       setComponent(unique);
//     };

//     const onClickSaveLayout = async () => {
//       const { layout: _, id, ...rest } = dynamicInfo;
//       const data = {
//         layout: layout,
//         ...rest,
//         id,
//       };
//       if (!layout.length)
//         return toast.error("하나 이상의 위젯을 추가해주세요!");

//       try {
//         if (id) await db.update("menu_config", data);
//         else await db.create("menu_config", data);
//       } catch (error) {
//         toast.error("저장에 실패했습니다!");
//       }
//       toast.success("성공적으로 저장되었습니다");
//     };

//     useImperativeHandle(ref, () => ({
//       externalFunction: onClickSetWidgets,
//       onClickSaveLayout,
//       onClickReset,
//     }));

//     const onClickReset = () => {
//       console.info("?");
//       setComponent([]);
//     };

//     const onLayoutChange = (newLayout: any) => {
//       setLayout(newLayout);
//     };

//     const handleDelete = (id: string) => {
//       setComponent((currentComponents) =>
//         currentComponents.filter((component) => component.id !== id)
//       );
//     };

//     return (
//       <>
//         <ResponsiveReactGridLayout
//           className="layout"
//           rowHeight={devMode ? 30 : rowHeight}
//           margin={devMode ? [10, 10] : [0, 0]}
//           width={width}
//           compactType={null}
//           onLayoutChange={onLayoutChange}
//         >
//           {Component.map(({ id, layout, component: Component }, index) => (
//             <Box key={id} data-grid={layout}>
//               <Component />
//               {devMode ? (
//                 <Box sx={{ display: "flex", justifyContent: "start" }}>
//                   <Button onClick={() => handleDelete(id)}>
//                     <ClearIcon />
//                   </Button>
//                 </Box>
//               ) : null}
//             </Box>
//           ))}
//         </ResponsiveReactGridLayout>
//       </>
//     );
//   }
// );

// export default Panel;
