import { useEffect, useState } from "react";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import StudentTable from "../../../components/manager/student/StudentTable";
import ReactPaginate from "react-paginate";
import Button from "../../../components/ui/button/Button";
import { getAllStudents } from "../../../api/api";

interface StudentList {
    studentId: number;
    identityCode: string;
    firstName: string;
    lastName: string;
    classId: number;
    schoolId: number;
}

const Student = () => {
    const [students, setStudents] = useState<StudentList[]>([]);
    const [currentPage, setCurrentPage] = useState(0); // 0-indexed
    const [totalPages, setTotalPages] = useState(1);
    const studentsPerPage = 1;

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
                    <Button className="space-y-6">Add a Student</Button>
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
        </>
    );
}

export default Student;