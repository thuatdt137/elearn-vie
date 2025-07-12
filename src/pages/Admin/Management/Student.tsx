import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import StudentTable from "../../../components/manager/student/StudentTable";
import ReactPaginate from "react-paginate";
import Button from "../../../components/ui/button/Button";
import { createStudent, getAllStudents } from "../../../api/api";
import { useModal } from "../../../hooks/useModal";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import { Modal } from "../../../components/ui/modal";

interface StudentList {
    studentId: number;
    identityCode: string;
    firstName: string;
    lastName: string;
    classId: number;
    schoolId: number;
}

interface StudentCreate {
    identityCode: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone: string;
    address: string;
}

export default function Student() {
    const [students, setStudents] = useState<StudentList[]>([]);
    const [currentPage, setCurrentPage] = useState(0); // 0-indexed
    const [totalPages, setTotalPages] = useState(1);
    const studentsPerPage = 10;
    const { isOpen, openModal, closeModal } = useModal();

    const [student, setStudent] = useState<StudentCreate>({
        identityCode: "",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        address: "",
    });

    const handleCreate = async () => {
        try {
            // Validate cơ bản
            if (!student.firstName || !student.lastName || !student.identityCode) {
                alert("Please fill in all required fields.");
                return;
            }

            console.log("Creating student:", student);

            // Gửi dữ liệu tới server
            const response = await createStudent(student);
            console.log("Create response:", response);
            alert("Student created successfully!");
            closeModal();
            fetchStudents(currentPage);
        } catch (error) {
            console.error("Create error", error);
            alert("An error occurred while creating the student.");
        }
    };


    const fetchStudents = async (page: number) => {
        try {
            const response = await getAllStudents({
                page: page + 1,      // convert 0-index to 1-index
                size: studentsPerPage,
            });
            setStudents(response.data.items); // assuming API returns { items, totalPages }
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStudents(currentPage);
    }, [currentPage]);

    return (
        <>
            <PageMeta title="Students" description="List of students with paging" />
            <PageBreadcrumb pageTitle="Students" />
            <div className="space-y-6">
                <ComponentCard title="Students">
                    <Button className="space-y-6" onClick={openModal}>Add a Student</Button>
                    <StudentTable students={students} />
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
                            Add a Student
                        </h4>
                    </div>
                    <form className="flex flex-col">
                        <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
                            <div className="mt-7">
                                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                                    Personal Information
                                </h5>

                                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Identity Code</Label>
                                        <Input type="text" placeholder="123456"
                                            value={student.identityCode}
                                            onChange={(e) => setStudent({ ...student, identityCode: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>First Name</Label>
                                        <Input type="text" placeholder="Musharof"
                                            value={student.firstName}
                                            onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Last Name</Label>
                                        <Input type="text" placeholder="Chowdhury"
                                            value={student.lastName}
                                            onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Date of Birth</Label>
                                        <Input type="date" placeholder="YYYY-MM-DD"
                                            value={student.dateOfBirth}
                                            onChange={(e) => setStudent({ ...student, dateOfBirth: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2 lg:col-span-1">
                                        <Label>Phone</Label>
                                        <Input type="text" placeholder="+09 363 398 46"
                                            value={student.phone}
                                            onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Label>Address</Label>
                                        <Input type="text" placeholder="123 Main St, City, Country"
                                            value={student.address}
                                            onChange={(e) => setStudent({ ...student, address: e.target.value })}
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

