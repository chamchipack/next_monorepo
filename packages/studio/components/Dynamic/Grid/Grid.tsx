// "use client";
// import { Box, Button } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Pagination } from "@/config/type/types";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import db from "@/api/module";

// // import DefaultGrid from "@/components/schema/DataGrid/DefaultGrid";
// import { DefaultType } from "@/config/type/DefaultType/type";
// import DefaultModal from "@/components/modal/DefaultModal";
// import { GridColDef } from "@mui/x-data-grid";

// const Btns = {
//   batchExcel: false,
//   excel: false,
//   register: true,
//   modify: true,
//   delete: true,
// };
// const GridProps = { checkboxSelection: false, rowSelection: true };

// type Toggle = React.Dispatch<React.SetStateAction<boolean>>;

// const Grid = ({
//   filterParams = {},
//   setToggle,
//   setDynamicInfo,
// }: {
//   filterParams: {};
//   setToggle: Toggle;
//   setDynamicInfo: React.Dispatch<React.SetStateAction<DefaultType["dynamic"]>>;
// }) => {
//   const router = useRouter();
//   const [rows, setRows] = useState({ total: 0, data: [] });
//   const [openModal, setOpenModal] = useState<boolean>(false);
//   const [pagination, setPagination] = useState<Pagination>({
//     page: 1,
//     perPage: 10,
//   });
//   const [selectedRow, setSelectedRow] = useState([]);

//   const handleClose = () => setOpenModal(false);
//   const handleOpen = () => setOpenModal(true);

//   const onClickRouting = (id: string) => {
//     router.push(`/monitor?id=${id}`, { scroll: false });
//   };

//   const columns: GridColDef[] = [
//     { field: "name", headerName: "이름", width: 120 },
//     { field: "desc", headerName: "설명", width: 120 },
//     {
//       field: "action",
//       headerName: "페이지 이동",
//       width: 120,
//       renderCell: ({ row: { id } }) => {
//         return (
//           <Button
//             variant="contained"
//             size="small"
//             sx={{
//               border: "1.5px solid #6A24FE",
//               background: "#ffffff",
//               color: "#6A24FE",
//             }}
//             onClick={() => {
//               onClickRouting(id);
//             }}
//           >
//             페이지 이동
//           </Button>
//         );
//       },
//     },
//   ];

//   const onLoadData = async () => {
//     const filter = {
//       pagination,
//       filter: {},
//     };
//     const { data: { totalItems = 0, items = [] } = {} } = await db.search(
//       "menu_config",
//       filter
//     );

//     setRows({ total: totalItems, data: items });
//   };
//   const onClickDialogOpen = (type: string) => {
//     if (type === "batch") return;

//     if (type === "register") {
//       handleOpen();
//       setDynamicInfo({ id: "", name: "", desc: "", items: [], layout: [] });
//       setToggle(true);
//     } else {
//       const [{ id, name, desc, items, layout }] = selectedRow || [];
//       setDynamicInfo({ id, name, desc, items, layout });
//       if (!selectedRow.every(({ id }: any) => id) && type === "modify")
//         return toast.error("필드를 선택해주세요");
//       if (selectedRow.length > 1 && type === "modify")
//         return toast.error("한개의 필드만 선택해주세요");

//       setToggle(true);
//     }
//   };

//   useEffect(() => {
//     onLoadData();
//   }, []);

//   return (
//     <>
//       {/* <DefaultGrid
//         filterParams={filterParams}
//         onLoadData={onLoadData}
//         GridProps={GridProps}
//         setPagination={setPagination}
//         setSelectedRow={setSelectedRow}
//         Btns={Btns}
//         renderingMode="server"
//         onClickDialog={onClickDialogOpen}
//         rows={rows}
//         columns={columns}
//       /> */}
//       {/* <DefaultModal
//         open={openModal}
//         onClose={handleClose}
//         title={`다이나믹 페이지`}
//       /> */}
//     </>
//   );
// };

// export default Grid;
