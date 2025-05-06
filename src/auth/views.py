from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from .models import EmailVerification

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Create email verification
            verification = EmailVerification.objects.create(user=user)
            
            # Send verification email
            verification_url = f"{settings.SITE_URL}/verify-email/{verification.token}"
            context = {
                'user': user,
                'verification_url': verification_url
            }
            email_body = render_to_string('auth/email/verification_email.html', context)
            
            send_mail(
                'Verify your email',
                email_body,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                html_message=email_body,
                fail_silently=False,
            )
            
            messages.success(request, 'Registration successful! Please check your email to verify your account.')
            return redirect('login')
        else:
            messages.error(request, 'Registration failed. Please correct the errors.')
    else:
        form = UserCreationForm()
    return render(request, 'auth/register.html', {'form': form})

def verify_email(request, token):
    try:
        verification = EmailVerification.objects.get(token=token)
        if not verification.is_verified:
            verification.is_verified = True
            verification.save()
            messages.success(request, 'Email verified successfully! You can now login.')
        else:
            messages.info(request, 'Email already verified.')
    except EmailVerification.DoesNotExist:
        messages.error(request, 'Invalid verification link.')
    return redirect('login')

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {username}!')
                return redirect('home')
        messages.error(request, 'Invalid username or password.')
    else:
        form = AuthenticationForm()
    return render(request, 'auth/login.html', {'form': form})

@login_required
def logout_view(request):
    logout(request)
    messages.info(request, 'You have been logged out.')
    return redirect('login') 