from django.shortcuts import render, redirect, get_object_or_404
from .models import Student
from .forms import StudentForm

# 1. The List View (This is what Django was missing!)
def student_list(request):
    students = Student.objects.all()
    return render(request, 'students/student_list.html', {'students': students})

# 2. The Add View
def add_student(request):
    if request.method == 'POST':
        form = StudentForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('student_list')
    else:
        form = StudentForm()
    return render(request, 'students/add_student.html', {'form': form})

# 3. The Delete View
def delete_student(request, id):
    student = get_object_or_404(Student, id=id)
    
    if request.method == 'POST':
        student.delete()
        return redirect('student_list')
        
    return render(request, 'students/delete_student.html', {'student': student})
