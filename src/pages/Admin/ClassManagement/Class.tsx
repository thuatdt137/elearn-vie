import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import ClassTable from "../../../components/manager/class/ClassTable";
import ReactPaginate from "react-paginate";
import Button from "../../../components/ui/button/Button";
import { getClassList, getAllSchools, getTeacherList, getAcademicYearList, createClass } from "../../../api/api";
import { useModal } from "../../../hooks/useModal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Modal } from "../../../components/ui/modal";
import { AxiosError } from "axios";

interface ClassCreate {
    className: string;
    academicYearId: number | "";
    teacherId: number | "";
    schoolId: number | "";
}

interface ClassList {
    classId: number;
    className: string;
    academicYearId: number;
    teacherId: number;
    schoolId: number;
}

export default function Class() {
    const [classes, setClasses] = useState<ClassList[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const classesPerPage = 10;
    const { isOpen, openModal, closeModal } = useModal();

    const [classData, setClassData] = useState<ClassCreate>({
        className: "",
        academicYearId: "",
        teacherId: "",
        schoolId: "",
    });

    const [schoolList, setSchoolList] = useState<{ schoolId: number; schoolName: string }[]>([]);
    const [teacherList, setTeacherList] = useState<{ teacherId: number; firstName: string; lastName: string }[]>([]);
    const [academicYearList, setAcademicYearList] = useState<{ academicYearId: number; yearName: string }[]>([]);

    const handleCreate = async () => {
        if (!classData.className || !classData.academicYearId || !classData.teacherId || !classData.schoolId) {
            alert("Vui lòng điền đầy đủ thông tin lớp học.");
            return;
        }
        try {
            const response = await createClass(classData);

            alert(response.message);
            closeModal();
            fetchClasses(currentPage);

        } catch (error: unknown) {  
            const err = error as AxiosError<any>;
            const errData = err.response?.data;
            alert(errData?.message);
        }
    };

    const fetchClasses = async (page: number) => {
        try {
            const response = await getClassList({ page: page + 1, size: classesPerPage });
            setClasses(response.data.items || response.data); // fallback nếu API trả về mảng
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setClasses([]);
            setTotalPages(1);
        }
    };

    useEffect(() => {
        fetchClasses(currentPage);
    }, [currentPage]);

    useEffect(() => {
        // Load các list cho form tạo mới
        const fetchMeta = async () => {
            try {
                const [schoolsRes, teachersRes, yearsRes] = await Promise.all([
                    getAllSchools({}),
                    getTeacherList({}),
                    getAcademicYearList(),
                ]);
                setSchoolList(schoolsRes.data);
                setTeacherList(teachersRes.data);
                setAcademicYearList(yearsRes.data);
            } catch (err) {
                setSchoolList([]);
                setTeacherList([]);
                setAcademicYearList([]);
            }
        };
        fetchMeta();
    }, []);

    return (
        <>
            <PageMeta title="Classes" description="List of classes with paging" />
            <PageBreadcrumb pageTitle="Classes" />
            <div className="space-y-6">
                <ComponentCard title="Classes">
                    <Button className="space-y-6" onClick={openModal}>Add a Class</Button>
                    <ClassTable classes={classes} />
                    <div className="flex justify-center mt-4">
                        <ReactPaginate
                            previousLabel={"←"}
                            nextLabel={"→"}
                            pageCount={totalPages}
                            onPageChange={({ selected }) => setCurrentPage(selected)}
                            forcePage={currentPage}
                            containerClassName="flex items-center justify-center gap-2 mt-4"
                            pageClassName="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                            activeClassName="bg-blue-500 text-white dark:bg-blue-400"
                            previousClassName="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                            nextClassName="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                            disabledClassName="opacity-50 cursor-not-allowed"
                            breakLabel="..."
                            breakClassName="px-3 py-1 text-gray-500 dark:text-gray-300"
                        />
                    </div>
                </ComponentCard>
            </div>
            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Add a Class
                        </h4>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Class Information
                                </h5>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Class Name</Label>
                                        <Input type="text" placeholder="10A1"
                                            value={classData.className}
                                            onChange={(e) => setClassData({ ...classData, className: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Academic Year</Label>
                                        <select
                                            className="w-full border rounded px-2 py-1"
                                            value={classData.academicYearId}
                                            onChange={e => setClassData({ ...classData, academicYearId: Number(e.target.value) })}
                                        >
                                            <option value="">Select Academic Year</option>
                                            {academicYearList.map(year => (
                                                <option key={year.academicYearId} value={year.academicYearId}>{year.yearName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Homeroom Teacher</Label>
                                        <select
                                            className="w-full border rounded px-2 py-1"
                                            value={classData.teacherId}
                                            onChange={e => setClassData({ ...classData, teacherId: Number(e.target.value) })}
                                        >
                                            <option value="">Select Teacher</option>
                                            {teacherList.map(teacher => (
                                                <option key={teacher.teacherId} value={teacher.teacherId}>{teacher.firstName + ' ' + teacher.lastName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>School</Label>
                                        <select
                                            className="w-full border rounded px-2 py-1"
                                            value={classData.schoolId}
                                            onChange={e => setClassData({ ...classData, schoolId: Number(e.target.value) })}
                                        >
                                            <option value="">Select School</option>
                                            {schoolList.map(school => (
                                                <option key={school.schoolId} value={school.schoolId}>{school.schoolName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal} type="button">
                                Close
                            </Button>
                            <Button size="sm" onClick={handleCreate} type="button">
                                Create
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
