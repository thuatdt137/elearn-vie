import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import ReactPaginate from "react-paginate";
import Button from "../../../components/ui/button/Button";
import { getAllSchools, getTeacherList } from "../../../api/api";
import { useModal } from "../../../hooks/useModal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Modal } from "../../../components/ui/modal";
import SchoolTable from "../../../components/manager/school/SchoolTable";
import Select from "../../../components/form/Select";

interface SchoolList {
    schoolId: number;
    schoolName: string;
    schoolType: string;
    principalId: number;
}

interface SchoolCreate {
    schoolName: string;
    schoolType: string;
    address?: string;
    phone?: string;
    email?: string;
    principalId?: number;
}

interface Teacher {
    teacherId: number;
    firstName: string;
    lastName: string;
}

interface SchoolType {
    typeId: number;
    typeName: string;
}

const initialSchoolTypes: SchoolType[] = [
    { typeId: 1, typeName: "Primary School" },
    { typeId: 2, typeName: "Secondary School" },
    { typeId: 3, typeName: "High School" },
];

export default function School() {
    const [schools, setSchools] = useState<SchoolList[]>([]);
    const [currentPage, setCurrentPage] = useState(0); // 0-indexed
    const [totalPages, setTotalPages] = useState(1);
    const schoolsPerPage = 10;
    const { isOpen, openModal, closeModal } = useModal();
    const [teacherList, setTeacherList] = useState<Teacher[]>([]);

    const fetchTeachers = async () => {
        try {
            const response = await getTeacherList({});
            setTeacherList(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const [school, setSchool] = useState<SchoolCreate>({
        schoolName: "",
        schoolType: "",
        address: "",
        phone: "",
        email: "",
        principalId: undefined,
    });


    const fetchSchools = async (page: number) => {
        try {
            const response = await getAllSchools({
                page: page + 1,      // convert 0-index to 1-index
                size: schoolsPerPage,
            });
            setSchools(response.data.items); // assuming API returns { items, totalPages }
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchSchools(currentPage),
                    fetchTeachers(),
                ]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [fetchSchools, fetchTeachers, currentPage]);

    function handleCreate(): void {

    }

    function handleSchoolChange(value: string): void {
        setSchool({ ...school, schoolType: value });
    }

    return (
        <>
            <PageMeta title="Schools" description="List of Schools with paging" />
            <PageBreadcrumb pageTitle="Schools" />
            <div className="space-y-6">
                <ComponentCard title="Schools">
                    <Button className="space-y-6" onClick={openModal}>Add a School</Button>
                    <SchoolTable schools={schools} />
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
                            Add a School
                        </h4>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Information
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>School Name<span className="text-red-500">*</span></Label>
                                        <Input type="text" placeholder="THPT Ly Thuong Kiet"
                                            error={school.schoolName === ""}
                                            hint="Please enter a school name."
                                            value={school.schoolName}
                                            onChange={(e) => setSchool({ ...school, schoolName: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>School Type<span className="text-red-500">*</span></Label>
                                        <Select
                                            options={initialSchoolTypes.map((school) => ({
                                                value: school.typeId.toString(),
                                                label: school.typeName,
                                            }))}
                                            className="dark:bg-dark-900"
                                            onChange={handleSchoolChange}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Email</Label>
                                        <Input type="email" placeholder="school@school.com"
                                            value={school.email}
                                            onChange={(e) => setSchool({ ...school, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Phone</Label>
                                        <Input type="text" placeholder="+09 363 398 46"
                                            value={school.phone}
                                            onChange={(e) => setSchool({ ...school, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label>Address</Label>
                                        <Input type="text" placeholder="123 Main St, City, Country"
                                            value={school.address}
                                            onChange={(e) => setSchool({ ...school, address: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Principal</Label>
                                        <Select
                                            options={teacherList.map((teacher) => ({
                                                value: teacher.teacherId.toString(),
                                                label: teacher.firstName + " " + teacher.lastName,
                                            }))}
                                            onChange={(e) => setSchool({ ...school, principalId: parseInt(e) })}
                                            className="dark:bg-dark-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Close
                            </Button>
                            <Button size="sm" onClick={handleCreate}>
                                Create
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
