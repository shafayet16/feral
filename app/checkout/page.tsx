'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileMenu from '../MobileMenu';
import { useCartStore } from '@/app/store/cartStore';

// Comprehensive dataset mapping Bangladeshi cities/districts to their respective divisions
const BD_CITIES = [
  // ==========================================
  // DHAKA DIVISION
  // ==========================================
  { name: 'Dhaka City', division: 'Dhaka' },
  { name: 'Dhanmondi', division: 'Dhaka' },
  { name: 'Uttara', division: 'Dhaka' },
  { name: 'Mirpur', division: 'Dhaka' },
  { name: 'Banani', division: 'Dhaka' },
  { name: 'Gulshan', division: 'Dhaka' },
  { name: 'Baridhara', division: 'Dhaka' },
  { name: 'Bashundhara R/A', division: 'Dhaka' },
  { name: 'Mohammadpur', division: 'Dhaka' },
  { name: 'Shyamoli', division: 'Dhaka' },
  { name: 'Kalyanpur', division: 'Dhaka' },
  { name: 'Gabtoli', division: 'Dhaka' },
  { name: 'Farmgate', division: 'Dhaka' },
  { name: 'Tejgaon', division: 'Dhaka' },
  { name: 'Mohakhali', division: 'Dhaka' },
  { name: 'Badda', division: 'Dhaka' },
  { name: 'Rampura', division: 'Dhaka' },
  { name: 'Khilgaon', division: 'Dhaka' },
  { name: 'Malibagh', division: 'Dhaka' },
  { name: 'Moghbazar', division: 'Dhaka' },
  { name: 'Kakrail', division: 'Dhaka' },
  { name: 'Paltan', division: 'Dhaka' },
  { name: 'Motijheel', division: 'Dhaka' },
  { name: 'Gulistan', division: 'Dhaka' },
  { name: 'Shahbagh', division: 'Dhaka' },
  { name: 'New Market', division: 'Dhaka' },
  { name: 'Hazaribagh', division: 'Dhaka' },
  { name: 'Lalbagh', division: 'Dhaka' },
  { name: 'Azimpur', division: 'Dhaka' },
  { name: 'Puran Dhaka', division: 'Dhaka' },
  { name: 'Sadarghat', division: 'Dhaka' },
  { name: 'Islampur-DHK', division: 'Dhaka' },
  { name: 'Sutrapur', division: 'Dhaka' },
  { name: 'Demra', division: 'Dhaka' },
  { name: 'Wari', division: 'Dhaka' },
  { name: 'Jatrabari', division: 'Dhaka' },
  { name: 'Sayedabad', division: 'Dhaka' },
  { name: 'Postogola', division: 'Dhaka' },
  { name: 'Keraniganj', division: 'Dhaka' },
  { name: 'Savar', division: 'Dhaka' },
  { name: 'Ashulia', division: 'Dhaka' },
  { name: 'Dhamrai', division: 'Dhaka' },
  { name: 'Tongi', division: 'Dhaka' },
  { name: 'Gazipur', division: 'Dhaka' },
  { name: 'Kaliakair', division: 'Dhaka' },
  { name: 'Sreepur', division: 'Dhaka' },
  { name: 'Kapasia', division: 'Dhaka' },
  { name: 'Kaliganj (Gazipur)', division: 'Dhaka' },
  { name: 'Narayanganj', division: 'Dhaka' },
  { name: 'Fatullah', division: 'Dhaka' },
  { name: 'Siddhirganj', division: 'Dhaka' },
  { name: 'Araihazar', division: 'Dhaka' },
  { name: 'Rupganj', division: 'Dhaka' },
  { name: 'Sonargaon', division: 'Dhaka' },
  { name: 'Narsingdi', division: 'Dhaka' },
  { name: 'Madhabdi', division: 'Dhaka' },
  { name: 'Raipura', division: 'Dhaka' },
  { name: 'Shibpur', division: 'Dhaka' },
  { name: 'Monohardi', division: 'Dhaka' },
  { name: 'Belabo', division: 'Dhaka' },
  { name: 'Manikganj', division: 'Dhaka' },
  { name: 'Singair', division: 'Dhaka' },
  { name: 'Saturia', division: 'Dhaka' },
  { name: 'Ghior', division: 'Dhaka' },
  { name: 'Shivalaya', division: 'Dhaka' },
  { name: 'Harirampur', division: 'Dhaka' },
  { name: 'Daulatpur (Manikganj)', division: 'Dhaka' },
  { name: 'Munshiganj', division: 'Dhaka' },
  { name: 'Sreenagar', division: 'Dhaka' },
  { name: 'Sirajdikhan', division: 'Dhaka' },
  { name: 'Louhajang', division: 'Dhaka' },
  { name: 'Tongibari', division: 'Dhaka' },
  { name: 'Gazaria', division: 'Dhaka' },
  { name: 'Tangail', division: 'Dhaka' },
  { name: 'Mirzapur', division: 'Dhaka' },
  { name: 'Kalihati', division: 'Dhaka' },
  { name: 'Ghatail', division: 'Dhaka' },
  { name: 'Madhupur', division: 'Dhaka' },
  { name: 'Gopalpur', division: 'Dhaka' },
  { name: 'Bhuapur', division: 'Dhaka' },
  { name: 'Dhanbari', division: 'Dhaka' },
  { name: 'Sakhipur', division: 'Dhaka' },
  { name: 'Basail', division: 'Dhaka' },
  { name: 'Delduar', division: 'Dhaka' },
  { name: 'Nagarpur', division: 'Dhaka' },
  { name: 'Faridpur', division: 'Dhaka' },
  { name: 'Bhanga', division: 'Dhaka' },
  { name: 'Boalmari', division: 'Dhaka' },
  { name: 'Madhukhali', division: 'Dhaka' },
  { name: 'Sadarpur', division: 'Dhaka' },
  { name: 'Nagarkanda', division: 'Dhaka' },
  { name: 'Charbhadrasan', division: 'Dhaka' },
  { name: 'Alfadanga', division: 'Dhaka' },
  { name: 'Saltha', division: 'Dhaka' },
  { name: 'Rajbari', division: 'Dhaka' },
  { name: 'Pangsha', division: 'Dhaka' },
  { name: 'Baliakandi', division: 'Dhaka' },
  { name: 'Goalandaghat', division: 'Dhaka' },
  { name: 'Kalukhali', division: 'Dhaka' },
  { name: 'Gopalganj', division: 'Dhaka' },
  { name: 'Muksudpur', division: 'Dhaka' },
  { name: 'Kashiani', division: 'Dhaka' },
  { name: 'Kotalipara', division: 'Dhaka' },
  { name: 'Tungipara', division: 'Dhaka' },
  { name: 'Madaripur', division: 'Dhaka' },
  { name: 'Shibchar', division: 'Dhaka' },
  { name: 'Kalkini', division: 'Dhaka' },
  { name: 'Rajoir', division: 'Dhaka' },
  { name: 'Shariatpur', division: 'Dhaka' },
  { name: 'Naria', division: 'Dhaka' },
  { name: 'Zanjira', division: 'Dhaka' },
  { name: 'Bhedarganj', division: 'Dhaka' },
  { name: 'Damudya', division: 'Dhaka' },
  { name: 'Gosairhat', division: 'Dhaka' },
  { name: 'Kishoreganj', division: 'Dhaka' },
  { name: 'Bhairab', division: 'Dhaka' },
  { name: 'Bajitpur', division: 'Dhaka' },
  { name: 'Katiadi', division: 'Dhaka' },
  { name: 'Pakundia', division: 'Dhaka' },
  { name: 'Karimganj', division: 'Dhaka' },
  { name: 'Hossainpur', division: 'Dhaka' },
  { name: 'Tarail', division: 'Dhaka' },
  { name: 'Itna', division: 'Dhaka' },
  { name: 'Mithamain', division: 'Dhaka' },
  { name: 'Austagram', division: 'Dhaka' },
  { name: 'Nikli', division: 'Dhaka' },
  { name: 'Kuliarchar', division: 'Dhaka' },

  // ==========================================
  // CHATTOGRAM DIVISION
  // ==========================================
  { name: 'Chattogram City', division: 'Chattogram' },
  { name: 'Agrabad', division: 'Chattogram' },
  { name: 'Halishahar', division: 'Chattogram' },
  { name: 'Nasirabad', division: 'Chattogram' },
  { name: 'Khulshi', division: 'Chattogram' },
  { name: 'Chawkbazar', division: 'Chattogram' },
  { name: 'Patenga', division: 'Chattogram' },
  { name: 'Pahartali', division: 'Chattogram' },
  { name: 'Chandgaon', division: 'Chattogram' },
  { name: 'Bakalia', division: 'Chattogram' },
  { name: 'Kotwali', division: 'Chattogram' },
  { name: 'Panchlaish', division: 'Chattogram' },
  { name: 'Double Mooring', division: 'Chattogram' },
  { name: 'Bayezid', division: 'Chattogram' },
  { name: 'Patiya', division: 'Chattogram' },
  { name: 'Hathazari', division: 'Chattogram' },
  { name: 'Sitakunda', division: 'Chattogram' },
  { name: 'Mirsharai', division: 'Chattogram' },
  { name: 'Raozan', division: 'Chattogram' },
  { name: 'Rangunia', division: 'Chattogram' },
  { name: 'Boalkhali', division: 'Chattogram' },
  { name: 'Anwara', division: 'Chattogram' },
  { name: 'Chandanaish', division: 'Chattogram' },
  { name: 'Satkania', division: 'Chattogram' },
  { name: 'Lohagara', division: 'Chattogram' },
  { name: 'Banshkhali', division: 'Chattogram' },
  { name: 'Sandwip', division: 'Chattogram' },
  { name: 'Cox\'s Bazar', division: 'Chattogram' },
  { name: 'Ukhiya', division: 'Chattogram' },
  { name: 'Teknaf', division: 'Chattogram' },
  { name: 'Ramu', division: 'Chattogram' },
  { name: 'Chakaria', division: 'Chattogram' },
  { name: 'Pekua', division: 'Chattogram' },
  { name: 'Maheshkhali', division: 'Chattogram' },
  { name: 'Kutubdia', division: 'Chattogram' },
  { name: 'Feni', division: 'Chattogram' },
  { name: 'Chhagalnaiya', division: 'Chattogram' },
  { name: 'Daganbhuiyan', division: 'Chattogram' },
  { name: 'Sonagazi', division: 'Chattogram' },
  { name: 'Fulgazi', division: 'Chattogram' },
  { name: 'Parshuram', division: 'Chattogram' },
  { name: 'Cumilla', division: 'Chattogram' },
  { name: 'Laksam', division: 'Chattogram' },
  { name: 'Daudkandi', division: 'Chattogram' },
  { name: 'Chauddagram', division: 'Chattogram' },
  { name: 'Muradnagar', division: 'Chattogram' },
  { name: 'Debidwar', division: 'Chattogram' },
  { name: 'Chandina', division: 'Chattogram' },
  { name: 'Burichang', division: 'Chattogram' },
  { name: 'Brahmanpara', division: 'Chattogram' },
  { name: 'Barura', division: 'Chattogram' },
  { name: 'Homna', division: 'Chattogram' },
  { name: 'Titas', division: 'Chattogram' },
  { name: 'Meghna', division: 'Chattogram' },
  { name: 'Nangalkot', division: 'Chattogram' },
  { name: 'Monohargonj', division: 'Chattogram' },
  { name: 'Lalmai', division: 'Chattogram' },
  { name: 'Brahmanbaria', division: 'Chattogram' },
  { name: 'Ashuganj', division: 'Chattogram' },
  { name: 'Sarail', division: 'Chattogram' },
  { name: 'Nabinagar', division: 'Chattogram' },
  { name: 'Kasba', division: 'Chattogram' },
  { name: 'Akhaura', division: 'Chattogram' },
  { name: 'Bancharampur', division: 'Chattogram' },
  { name: 'Nasirnagar', division: 'Chattogram' },
  { name: 'Bijoynagar', division: 'Chattogram' },
  { name: 'Noakhali', division: 'Chattogram' },
  { name: 'Maijdee', division: 'Chattogram' },
  { name: 'Chowmuhani', division: 'Chattogram' },
  { name: 'Begumganj', division: 'Chattogram' },
  { name: 'Chatkhil', division: 'Chattogram' },
  { name: 'Senbagh', division: 'Chattogram' },
  { name: 'Companiganj (Noakhali)', division: 'Chattogram' },
  { name: 'Sonaimuri', division: 'Chattogram' },
  { name: 'Subarnachar', division: 'Chattogram' },
  { name: 'Kabirhat', division: 'Chattogram' },
  { name: 'Hatiya', division: 'Chattogram' },
  { name: 'Lakshmipur', division: 'Chattogram' },
  { name: 'Ramganj', division: 'Chattogram' },
  { name: 'Raipur', division: 'Chattogram' },
  { name: 'Ramgati', division: 'Chattogram' },
  { name: 'Kamalnagar', division: 'Chattogram' },
  { name: 'Chandpur', division: 'Chattogram' },
  { name: 'Hajiganj', division: 'Chattogram' },
  { name: 'Faridganj', division: 'Chattogram' },
  { name: 'Kachua (Chandpur)', division: 'Chattogram' },
  { name: 'Shahrasti', division: 'Chattogram' },
  { name: 'Matlab', division: 'Chattogram' },
  { name: 'Haimchar', division: 'Chattogram' },
  { name: 'Rangamal', division: 'Chattogram' },
  { name: 'Rangamati', division: 'Chattogram' },
  { name: 'Kaptai', division: 'Chattogram' },
  { name: 'Langadu', division: 'Chattogram' },
  { name: 'Baghaichhari', division: 'Chattogram' },
  { name: 'Barkal', division: 'Chattogram' },
  { name: 'Juraichhari', division: 'Chattogram' },
  { name: 'Belaichhari', division: 'Chattogram' },
  { name: 'Rajasthali', division: 'Chattogram' },
  { name: 'Kawkhali (Rangamati)', division: 'Chattogram' },
  { name: 'Naniarchar', division: 'Chattogram' },
  { name: 'Khagrachhari', division: 'Chattogram' },
  { name: 'Matiranga', division: 'Chattogram' },
  { name: 'Dighinala', division: 'Chattogram' },
  { name: 'Ramgarh', division: 'Chattogram' },
  { name: 'Panchhari', division: 'Chattogram' },
  { name: 'Mahalchhari', division: 'Chattogram' },
  { name: 'Manikchhari', division: 'Chattogram' },
  { name: 'Lakshmichhari', division: 'Chattogram' },
  { name: 'Bandarban', division: 'Chattogram' },
  { name: 'Lama', division: 'Chattogram' },
  { name: 'Alikadam', division: 'Chattogram' },
  { name: 'Naikhongchhari', division: 'Chattogram' },
  { name: 'Rowangchhari', division: 'Chattogram' },
  { name: 'Ruma', division: 'Chattogram' },
  { name: 'Thanchi', division: 'Chattogram' },

  // ==========================================
  // RAJSHAHI DIVISION
  // ==========================================
  { name: 'Rajshahi City', division: 'Rajshahi' },
  { name: 'Boalia', division: 'Rajshahi' },
  { name: 'Motihar', division: 'Rajshahi' },
  { name: 'Rajpara', division: 'Rajshahi' },
  { name: 'Shah Makhdum', division: 'Rajshahi' },
  { name: 'Paba', division: 'Rajshahi' },
  { name: 'Godagari', division: 'Rajshahi' },
  { name: 'Tanore', division: 'Rajshahi' },
  { name: 'Mohanpur', division: 'Rajshahi' },
  { name: 'Bagmara', division: 'Rajshahi' },
  { name: 'Durgapur (Rajshahi)', division: 'Rajshahi' },
  { name: 'Puthia', division: 'Rajshahi' },
  { name: 'Charghat', division: 'Rajshahi' },
  { name: 'Bagha', division: 'Rajshahi' },
  { name: 'Bogura', division: 'Rajshahi' },
  { name: 'Sherpur (Bogura)', division: 'Rajshahi' },
  { name: 'Shajahanpur', division: 'Rajshahi' },
  { name: 'Gabtali', division: 'Rajshahi' },
  { name: 'Kahaloo', division: 'Rajshahi' },
  { name: 'Dupchanchia', division: 'Rajshahi' },
  { name: 'Adamdighi', division: 'Rajshahi' },
  { name: 'Shibganj (Bogura)', division: 'Rajshahi' },
  { name: 'Sonatala', division: 'Rajshahi' },
  { name: 'Sariakandi', division: 'Rajshahi' },
  { name: 'Dhunat', division: 'Rajshahi' },
  { name: 'Nandigram', division: 'Rajshahi' },
  { name: 'Pabna', division: 'Rajshahi' },
  { name: 'Ishwardi', division: 'Rajshahi' },
  { name: 'Santhia', division: 'Rajshahi' },
  { name: 'Bera', division: 'Rajshahi' },
  { name: 'Sujanagar', division: 'Rajshahi' },
  { name: 'Chatmohar', division: 'Rajshahi' },
  { name: 'Bhangura', division: 'Rajshahi' },
  { name: 'Faridpur (Pabna)', division: 'Rajshahi' },
  { name: 'Atgharia', division: 'Rajshahi' },
  { name: 'Natore', division: 'Rajshahi' },
  { name: 'Singra', division: 'Rajshahi' },
  { name: 'Baraigram', division: 'Rajshahi' },
  { name: 'Gurudaspur', division: 'Rajshahi' },
  { name: 'Lalpur', division: 'Rajshahi' },
  { name: 'Bagatipara', division: 'Rajshahi' },
  { name: 'Naldanga', division: 'Rajshahi' },
  { name: 'Naogaon', division: 'Rajshahi' },
  { name: 'Manda', division: 'Rajshahi' },
  { name: 'Mohadevpur', division: 'Rajshahi' },
  { name: 'Patnitala', division: 'Rajshahi' },
  { name: 'Dhamoirhat', division: 'Rajshahi' },
  { name: 'Sapahar', division: 'Rajshahi' },
  { name: 'Porsha', division: 'Rajshahi' },
  { name: 'Niamatpur', division: 'Rajshahi' },
  { name: 'Atrai', division: 'Rajshahi' },
  { name: 'Raninagar', division: 'Rajshahi' },
  { name: 'Badalgachhi', division: 'Rajshahi' },
  { name: 'Sirajganj', division: 'Rajshahi' },
  { name: 'Shahjadpur', division: 'Rajshahi' },
  { name: 'Ullahpara', division: 'Rajshahi' },
  { name: 'Belkuchi', division: 'Rajshahi' },
  { name: 'Kamarkhanda', division: 'Rajshahi' },
  { name: 'Raiganj', division: 'Rajshahi' },
  { name: 'Tarash', division: 'Rajshahi' },
  { name: 'Kazipur', division: 'Rajshahi' },
  { name: 'Chauhali', division: 'Rajshahi' },
  { name: 'Joypurhat', division: 'Rajshahi' },
  { name: 'Panchbibi', division: 'Rajshahi' },
  { name: 'Kalai', division: 'Rajshahi' },
  { name: 'Khetlal', division: 'Rajshahi' },
  { name: 'Akkelpur', division: 'Rajshahi' },
  { name: 'Chapainawabganj', division: 'Rajshahi' },
  { name: 'Shibganj (Nawabganj)', division: 'Rajshahi' },
  { name: 'Gomastapur', division: 'Rajshahi' },
  { name: 'Nachole', division: 'Rajshahi' },
  { name: 'Bholahat', division: 'Rajshahi' },

  // ==========================================
  // KHULNA DIVISION
  // ==========================================
  { name: 'Khulna City', division: 'Khulna' },
  { name: 'Sonadanga', division: 'Khulna' },
  { name: 'Khalishpur', division: 'Khulna' },
  { name: 'Daulatpur (Khulna)', division: 'Khulna' },
  { name: 'Khan Jahan Ali', division: 'Khulna' },
  { name: 'Rupsha', division: 'Khulna' },
  { name: 'Dumuria', division: 'Khulna' },
  { name: 'Batiaghata', division: 'Khulna' },
  { name: 'Phultala', division: 'Khulna' },
  { name: 'Dighalia', division: 'Khulna' },
  { name: 'Terokhada', division: 'Khulna' },
  { name: 'Paikgachha', division: 'Khulna' },
  { name: 'Dacope', division: 'Khulna' },
  { name: 'Koyra', division: 'Khulna' },
  { name: 'Jashore', division: 'Khulna' },
  { name: 'Jhikargachha', division: 'Khulna' },
  { name: 'Sharsha', division: 'Khulna' },
  { name: 'Benapole', division: 'Khulna' },
  { name: 'Manirampur', division: 'Khulna' },
  { name: 'Keshabpur', division: 'Khulna' },
  { name: 'Chaugachha', division: 'Khulna' },
  { name: 'Abhaynagar', division: 'Khulna' },
  { name: 'Bagherpara', division: 'Khulna' },
  { name: 'Satkhira', division: 'Khulna' },
  { name: 'Kalaroa', division: 'Khulna' },
  { name: 'Tala', division: 'Khulna' },
  { name: 'Debhata', division: 'Khulna' },
  { name: 'Kaliganj (Satkhira)', division: 'Khulna' },
  { name: 'Shyamnagar', division: 'Khulna' },
  { name: 'Assasuni', division: 'Khulna' },
  { name: 'Bagerhat', division: 'Khulna' },
  { name: 'Mongla', division: 'Khulna' },
  { name: 'Morrelganj', division: 'Khulna' },
  { name: 'Sharankhola', division: 'Khulna' },
  { name: 'Rampal', division: 'Khulna' },
  { name: 'Fakirhat', division: 'Khulna' },
  { name: 'Kachua (Bagerhat)', division: 'Khulna' },
  { name: 'Chitalmari', division: 'Khulna' },
  { name: 'Mollahat', division: 'Khulna' },
  { name: 'Kushtia', division: 'Khulna' },
  { name: 'Kumarkhali', division: 'Khulna' },
  { name: 'Bheramara', division: 'Khulna' },
  { name: 'Mirpur (Kushtia)', division: 'Khulna' },
  { name: 'Daulatpur (Kushtia)', division: 'Khulna' },
  { name: 'Khoksa', division: 'Khulna' },
  { name: 'Jhenaidah', division: 'Khulna' },
  { name: 'Shailkupa', division: 'Khulna' },
  { name: 'Kaliganj (Jhenaidah)', division: 'Khulna' },
  { name: 'Kotchandpur', division: 'Khulna' },
  { name: 'Maheshpur', division: 'Khulna' },
  { name: 'Harinakunda', division: 'Khulna' },
  { name: 'Chuadanga', division: 'Khulna' },
  { name: 'Alamdanga', division: 'Khulna' },
  { name: 'Damurhuda', division: 'Khulna' },
  { name: 'Jibannagar', division: 'Khulna' },
  { name: 'Meherpur', division: 'Khulna' },
  { name: 'Gangni', division: 'Khulna' },
  { name: 'Mujibnagar', division: 'Khulna' },
  { name: 'Magura', division: 'Khulna' },
  { name: 'Sreepur (Magura)', division: 'Khulna' },
  { name: 'Mohammadpur (Magura)', division: 'Khulna' },
  { name: 'Shalikha', division: 'Khulna' },
  { name: 'Narail', division: 'Khulna' },
  { name: 'Lohagara (Narail)', division: 'Khulna' },
  { name: 'Kalia', division: 'Khulna' },

  // ==========================================
  // SYLHET DIVISION
  // ==========================================
  { name: 'Sylhet City', division: 'Sylhet' },
  { name: 'Zindabazar', division: 'Sylhet' },
  { name: 'Amberkhana', division: 'Sylhet' },
  { name: 'Bandarbazar', division: 'Sylhet' },
  { name: 'Uposhohor', division: 'Sylhet' },
  { name: 'South Surma', division: 'Sylhet' },
  { name: 'Bishwanath', division: 'Sylhet' },
  { name: 'Balaganj', division: 'Sylhet' },
  { name: 'Fenchuganj', division: 'Sylhet' },
  { name: 'Golapganj', division: 'Sylhet' },
  { name: 'Beanibazar', division: 'Sylhet' },
  { name: 'Zakiganj', division: 'Sylhet' },
  { name: 'Kanaighat', division: 'Sylhet' },
  { name: 'Jaintiapur', division: 'Sylhet' },
  { name: 'Gowainghat', division: 'Sylhet' },
  { name: 'Companiganj (Sylhet)', division: 'Sylhet' },
  { name: 'Osmani Nagar', division: 'Sylhet' },
  { name: 'Moulvibazar', division: 'Sylhet' },
  { name: 'Sreemangal', division: 'Sylhet' },
  { name: 'Kulaura', division: 'Sylhet' },
  { name: 'Kamalganj', division: 'Sylhet' },
  { name: 'Rajnagar', division: 'Sylhet' },
  { name: 'Barlekha', division: 'Sylhet' },
  { name: 'Juri', division: 'Sylhet' },
  { name: 'Habiganj', division: 'Sylhet' },
  { name: 'Nabiganj', division: 'Sylhet' },
  { name: 'Madhabpur', division: 'Sylhet' },
  { name: 'Chunarughat', division: 'Sylhet' },
  { name: 'Baniachong', division: 'Sylhet' },
  { name: 'Bahubal', division: 'Sylhet' },
  { name: 'Lakhai', division: 'Sylhet' },
  { name: 'Ajmiriganj', division: 'Sylhet' },
  { name: 'Sunamganj', division: 'Sylhet' },
  { name: 'Chhatak', division: 'Sylhet' },
  { name: 'Jagannathpur', division: 'Sylhet' },
  { name: 'Derai', division: 'Sylhet' },
  { name: 'Tahirpur', division: 'Sylhet' },
  { name: 'Jamalganj', division: 'Sylhet' },
  { name: 'Dharmapasha', division: 'Sylhet' },
  { name: 'Sullah', division: 'Sylhet' },
  { name: 'Dowarabazar', division: 'Sylhet' },
  { name: 'Bishwamvarpur', division: 'Sylhet' },
  { name: 'Shantiganj', division: 'Sylhet' },

  // ==========================================
  // RANGPUR DIVISION
  // ==========================================
  { name: 'Rangpur City', division: 'Rangpur' },
  { name: 'Badarganj', division: 'Rangpur' },
  { name: 'Mithapukur', division: 'Rangpur' },
  { name: 'Pirganj (Rangpur)', division: 'Rangpur' },
  { name: 'Pirgachha', division: 'Rangpur' },
  { name: 'Kaunia', division: 'Rangpur' },
  { name: 'Gangachhara', division: 'Rangpur' },
  { name: 'Taraganj', division: 'Rangpur' },
  { name: 'Dinajpur', division: 'Rangpur' },
  { name: 'Hili', division: 'Rangpur' },
  { name: 'Hakimpur', division: 'Rangpur' },
  { name: 'Birampur', division: 'Rangpur' },
  { name: 'Phulbari (Dinajpur)', division: 'Rangpur' },
  { name: 'Parbatipur', division: 'Rangpur' },
  { name: 'Chirirbandar', division: 'Rangpur' },
  { name: 'Biral', division: 'Rangpur' },
  { name: 'Bochaganj', division: 'Rangpur' },
  { name: 'Birganj', division: 'Rangpur' },
  { name: 'Kaharole', division: 'Rangpur' },
  { name: 'Khansama', division: 'Rangpur' },
  { name: 'Nawabganj (Dinajpur)', division: 'Rangpur' },
  { name: 'Ghoraghat', division: 'Rangpur' },
  { name: 'Saidpur', division: 'Rangpur' },
  { name: 'Nilphamari', division: 'Rangpur' },
  { name: 'Jaldhaka', division: 'Rangpur' },
  { name: 'Domar', division: 'Rangpur' },
  { name: 'Dimla', division: 'Rangpur' },
  { name: 'Kishoreganj (Nilphamari)', division: 'Rangpur' },
  { name: 'Kurigram', division: 'Rangpur' },
  { name: 'Ulipur', division: 'Rangpur' },
  { name: 'Nageshwari', division: 'Rangpur' },
  { name: 'Bhurungamari', division: 'Rangpur' },
  { name: 'Chilmari', division: 'Rangpur' },
  { name: 'Rajarhat', division: 'Rangpur' },
  { name: 'Raomari', division: 'Rangpur' },
  { name: 'Char Rajibpur', division: 'Rangpur' },
  { name: 'Phulbari (Kurigram)', division: 'Rangpur' },
  { name: 'Gaibandha', division: 'Rangpur' },
  { name: 'Gobindaganj', division: 'Rangpur' },
  { name: 'Palashbari', division: 'Rangpur' },
  { name: 'Sadullapur', division: 'Rangpur' },
  { name: 'Sundarganj', division: 'Rangpur' },
  { name: 'Shagatta', division: 'Rangpur' },
  { name: 'Phulchhari', division: 'Rangpur' },
  { name: 'Lalmonirhat', division: 'Rangpur' },
  { name: 'Patgram', division: 'Rangpur' },
  { name: 'Hatibandha', division: 'Rangpur' },
  { name: 'Kaliganj (Lalmonirhat)', division: 'Rangpur' },
  { name: 'Aditmari', division: 'Rangpur' },
  { name: 'Thakurgaon', division: 'Rangpur' },
  { name: 'Pirganj (Thakurgaon)', division: 'Rangpur' },
  { name: 'Baliadangi', division: 'Rangpur' },
  { name: 'Ranisankail', division: 'Rangpur' },
  { name: 'Haripur', division: 'Rangpur' },
  { name: 'Panchagarh', division: 'Rangpur' },
  { name: 'Tetulia', division: 'Rangpur' },
  { name: 'Boda', division: 'Rangpur' },
  { name: 'Debiganj', division: 'Rangpur' },
  { name: 'Atwari', division: 'Rangpur' },

  // ==========================================
  // BARISAL DIVISION
  // ==========================================
  { name: 'Barisal City', division: 'Barisal' },
  { name: 'Bakerganj', division: 'Barisal' },
  { name: 'Gournadi', division: 'Barisal' },
  { name: 'Wazirpur', division: 'Barisal' },
  { name: 'Banaripara', division: 'Barisal' },
  { name: 'Babuganj', division: 'Barisal' },
  { name: 'Muladi', division: 'Barisal' },
  { name: 'Hizla', division: 'Barisal' },
  { name: 'Mehendiganj', division: 'Barisal' },
  { name: 'Agailjhara', division: 'Barisal' },
  { name: 'Bhola', division: 'Barisal' },
  { name: 'Char Fasson', division: 'Barisal' },
  { name: 'Lalmohan', division: 'Barisal' },
  { name: 'Burhanuddin', division: 'Barisal' },
  { name: 'Daulatkhan', division: 'Barisal' },
  { name: 'Tazumuddin', division: 'Barisal' },
  { name: 'Manpura', division: 'Barisal' },
  { name: 'Patuakhali', division: 'Barisal' },
  { name: 'Kuakata', division: 'Barisal' },
  { name: 'Kalapara', division: 'Barisal' },
  { name: 'Bauphal', division: 'Barisal' },
  { name: 'Galachipa', division: 'Barisal' },
  { name: 'Dashmina', division: 'Barisal' },
  { name: 'Dumki', division: 'Barisal' },
  { name: 'Mirzaganj', division: 'Barisal' },
  { name: 'Rangabali', division: 'Barisal' },
  { name: 'Pirojpur', division: 'Barisal' },
  { name: 'Mathbaria', division: 'Barisal' },
  { name: 'Swarupkati', division: 'Barisal' },
  { name: 'Nesarabad', division: 'Barisal' },
  { name: 'Bhandaria', division: 'Barisal' },
  { name: 'Nazirpur', division: 'Barisal' },
  { name: 'Kawkhali (Pirojpur)', division: 'Barisal' },
  { name: 'Indurkani', division: 'Barisal' },
  { name: 'Barguna', division: 'Barisal' },
  { name: 'Amtali', division: 'Barisal' },
  { name: 'Patharghata', division: 'Barisal' },
  { name: 'Betagi', division: 'Barisal' },
  { name: 'Bamna', division: 'Barisal' },
  { name: 'Taltali', division: 'Barisal' },
  { name: 'Jhalokathi', division: 'Barisal' },
  { name: 'Nalchity', division: 'Barisal' },
  { name: 'Rajapur', division: 'Barisal' },
  { name: 'Kathalia', division: 'Barisal' },

  // ==========================================
  // MYMENSINGH DIVISION
  // ==========================================
  { name: 'Mymensingh City', division: 'Mymensingh' },
  { name: 'Trishal', division: 'Mymensingh' },
  { name: 'Bhaluka', division: 'Mymensingh' },
  { name: 'Muktagachha', division: 'Mymensingh' },
  { name: 'Gaffargaon', division: 'Mymensingh' },
  { name: 'Ishwarganj', division: 'Mymensingh' },
  { name: 'Nandail', division: 'Mymensingh' },
  { name: 'Gauripur', division: 'Mymensingh' },
  { name: 'Phulpur', division: 'Mymensingh' },
  { name: 'Haluaghat', division: 'Mymensingh' },
  { name: 'Dhobaura', division: 'Mymensingh' },
  { name: 'Tarakanda', division: 'Mymensingh' },
  { name: 'Jamalpur', division: 'Mymensingh' },
  { name: 'Sarishabari', division: 'Mymensingh' },
  { name: 'Melandaha', division: 'Mymensingh' },
  { name: 'Madarganj', division: 'Mymensingh' },
  { name: 'Islampur', division: 'Mymensingh' },
  { name: 'Dewanganj', division: 'Mymensingh' },
  { name: 'Baksiganj', division: 'Mymensingh' },
  { name: 'Netrokona', division: 'Mymensingh' },
  { name: 'Mohanganj', division: 'Mymensingh' },
  { name: 'Kendua', division: 'Mymensingh' },
  { name: 'Purbadhala', division: 'Mymensingh' },
  { name: 'Durgapur (Netrokona)', division: 'Mymensingh' },
  { name: 'Kalmakanda', division: 'Mymensingh' },
  { name: 'Barhatta', division: 'Mymensingh' },
  { name: 'Atpara', division: 'Mymensingh' },
  { name: 'Madan', division: 'Mymensingh' },
  { name: 'Khaliajuri', division: 'Mymensingh' },
  { name: 'Sherpur', division: 'Mymensingh' },
  { name: 'Nalitabari', division: 'Mymensingh' },
  { name: 'Sreebardi', division: 'Mymensingh' },
  { name: 'Nakla', division: 'Mymensingh' },
  { name: 'Jhenaigati', division: 'Mymensingh' }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, fetchCart } = useCartStore();

  const [scrolled, setScrolled] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [isBuyNow, setIsBuyNow] = useState(false);
  const [hasCheckedData, setHasCheckedData] = useState(false);

  // Autocomplete functional states
  const [citySuggestions, setCitySuggestions] = useState<{ name: string; division: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    division: 'Dhaka',
    postalCode: '',
    address: '',
    paymentMethod: 'cod',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const loadData = async () => {
      await fetchCart();
      setHasCheckedData(true);
    };

    loadData();

    // Close recommendations panel if user clicks outside container
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const singleItemRaw = localStorage.getItem('checkoutItem');

    if (cartItems && cartItems.length > 0) {
      setCheckoutItems(cartItems);
      setIsBuyNow(false);
      localStorage.removeItem('checkoutItem');
    } else if (singleItemRaw) {
      try {
        const parsed = JSON.parse(singleItemRaw);
        setCheckoutItems([{ ...parsed, product_id: parsed.id }]);
        setIsBuyNow(true);
      } catch (e) {
        console.error("Error parsing buy now payload:", e);
      }
    } else if (hasCheckedData && cartItems.length === 0) {
      router.push('/shop');
    }
  }, [cartItems, hasCheckedData]);

  const subtotal = checkoutItems.reduce((acc, item) => {
    const rawPrice = item.price ?? item.products?.price ?? 0;
    const cleanPrice = Number(rawPrice);
    const qty = item.quantity || 1;
    return acc + (cleanPrice * qty);
  }, 0);

  const shippingCost = formData.division === 'Dhaka' ? 80 : 130;
  const orderTotal = subtotal + shippingCost;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Realtime city filtering triggers
    if (name === 'city') {
      if (value.trim().length > 0) {
        const filtered = BD_CITIES.filter(item =>
          item.name.toLowerCase().includes(value.toLowerCase())
        );
        setCitySuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectCity = (cityName: string, divisionName: string) => {
    setFormData(prev => ({
      ...prev,
      city: cityName,
      division: divisionName // Automatic assignment sets shipping variables perfectly
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.division
    ) {
      alert('Please fill in all required fields');
      return;
    }
    if (formData.paymentMethod !== 'cod' && !transactionId.trim()) {
      alert('Please enter the transaction ID for your payment');
      return;
    }

    setIsProcessing(true);

    const orderPayload = {
      action: 'checkout',
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      division: formData.division,
      paymentMethod: formData.paymentMethod,
      shippingCost,
      total: orderTotal,
      transactionId: transactionId || null,
      items: checkoutItems.map(item => ({
        product_id: item.product_id,
        name: item.name ?? item.products?.name ?? 'Feral Item',
        price: item.price ?? item.products?.price ?? 0,
        quantity: item.quantity,
        size: item.size,
      })),
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
        credentials: 'include',
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Checkout failed');
      }

      const result = await res.json();

      if (isBuyNow) localStorage.removeItem('checkoutItem');
      localStorage.setItem('lastOrder', JSON.stringify(result));
      router.push('/order-confirmation');
    } catch (error: any) {
      alert('Error placing order: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!hasCheckedData && checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-[#f4f4f5] overflow-x-hidden">
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/20'
            : 'bg-[#0a0a0a]/80 backdrop-blur-sm border-b border-[#52525b]/20'
        }`}
      >
        <div className="px-4 py-2 md:py-3 md:px-8">
          <div className="flex items-center justify-between md:hidden">
            <div className="w-8">
              <MobileMenu />
            </div>
            <div>
              <img src="/ferallogu.png" alt="FERAL" className="h-12 w-auto" />
            </div>
            <Link href="/cart" className="text-[#d4d4d8] hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
              </svg>
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center gap-6">
              <MobileMenu />
            </div>
            <div>
              <img src="/ferallogu.png" alt="FERAL" className="h-16 w-auto" />
            </div>
            <Link href="/cart" className="text-[#d4d4d8] hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="h-14 md:h-16" />

      {/* CHECKOUT CONTENT */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-center mb-8">
          CHECKOUT
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Order Summary Sidebar */}
          <div className="md:order-2">
            <div className="bg-[#18181b] border border-[#52525b]/20 p-6 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-4">
                ORDER SUMMARY
              </h2>
              <div className="space-y-4 mb-4 pb-4 border-b border-[#52525b]/20">
                {checkoutItems.map((item, index) => {
                  const name = item.name ?? item.products?.name ?? 'Feral Apparel';
                  const rawPrice = item.price ?? item.products?.price ?? 0;
                  const price = Number(rawPrice);
                  const image = item.image ?? item.products?.image ?? '/feralshirt1.png';
                  return (
                    <div
                      key={`${item.id}-${item.size}-${index}`}
                      className="flex gap-4 items-start"
                    >
                      <div className="w-20 h-24 bg-[#0a0a0a] overflow-hidden flex-shrink-0">
                        <img src={image} alt={name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium uppercase">{name}</h3>
                        <p className="text-xs text-[#a1a1aa]">Size: {item.size}</p>
                        <p className="text-xs text-[#a1a1aa]">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold mt-1">
                          ৳{(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#a1a1aa]">Shipping ({formData.division})</span>
                  <span>৳{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#52525b]/20 font-bold">
                  <span>Total</span>
                  <span>৳{orderTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="md:col-span-2 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-[#18181b] border border-[#52525b]/20 p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4">
                  SHIPPING INFORMATION
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
                    />
                  </div>

                  {/* Smart Autocomplete City Field */}
                  <div className="relative" ref={autocompleteRef}>
                    <label className="block text-xs text-[#a1a1aa] mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      autoComplete="off"
                      value={formData.city}
                      onChange={handleInputChange}
                      onFocus={() => formData.city && setShowSuggestions(true)}
                      className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
                      placeholder="Type your city (e.g. Dhaka, Bogura)"
                    />
                    
                    {/* Floating Brutalist Results List */}
                    {showSuggestions && citySuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[#0a0a0a] border border-[#52525b]/50 z-50 rounded shadow-2xl custom-scrollbar">
                        {citySuggestions.map((cityObj) => (
                          <div
                            key={cityObj.name}
                            onClick={() => handleSelectCity(cityObj.name, cityObj.division)}
                            className="px-4 py-3 text-sm cursor-pointer border-b border-[#52525b]/10 text-left text-zinc-300 hover:bg-white hover:text-black transition-colors duration-150 font-medium flex justify-between items-center"
                          >
                            <span>{cityObj.name}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono">
                              {cityObj.division}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Read-only Automated Division Tracker */}
                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-1">
                      Division (Auto-filled)
                    </label>
                    <input
                      type="text"
                      name="division"
                      readOnly
                      value={formData.division}
                      className="w-full bg-[#18181b] border border-[#52525b]/20 rounded px-4 py-3 text-sm text-zinc-400 select-none cursor-not-allowed outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#a1a1aa] mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
                      placeholder="e.g. 1230"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs text-[#a1a1aa] mb-1">
                      Address (Area, House, Road No.) *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
                      placeholder="e.g. House 42, Road 11"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-[#18181b] border border-[#52525b]/20 p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-4">
                  PAYMENT METHOD
                </h2>
                <div className="grid gap-3">
                  {/* Cash on Delivery Card */}
                  <label
                    className={`flex items-center justify-between p-4 border transition-all duration-300 cursor-pointer rounded select-none ${
                      formData.paymentMethod === 'cod'
                        ? 'border-white bg-[#27272a]'
                        : 'border-[#52525b]/30 bg-[#0a0a0a] hover:border-[#52525b]/70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 border flex items-center justify-center transition-all duration-300 ${
                          formData.paymentMethod === 'cod'
                            ? 'border-white bg-white'
                            : 'border-[#52525b]/60 bg-transparent'
                        }`}
                      >
                        {formData.paymentMethod === 'cod' && (
                          <div className="w-2 h-2 bg-black" />
                        )}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Cash on Delivery
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                  </label>

                  {/* bKash Card */}
                  <label
                    className={`flex items-center justify-between p-4 border transition-all duration-300 cursor-pointer rounded select-none ${
                      formData.paymentMethod === 'bkash'
                        ? 'border-white bg-[#27272a]'
                        : 'border-[#52525b]/30 bg-[#0a0a0a] hover:border-[#52525b]/70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 border flex items-center justify-center transition-all duration-300 ${
                          formData.paymentMethod === 'bkash'
                            ? 'border-white bg-white'
                            : 'border-[#52525b]/60 bg-transparent'
                        }`}
                      >
                        {formData.paymentMethod === 'bkash' && (
                          <div className="w-2 h-2 bg-black" />
                        )}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        bKash
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={formData.paymentMethod === 'bkash'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                  </label>

                  {/* Nagad Card */}
                  <label
                    className={`flex items-center justify-between p-4 border transition-all duration-300 cursor-pointer rounded select-none ${
                      formData.paymentMethod === 'nagad'
                        ? 'border-white bg-[#27272a]'
                        : 'border-[#52525b]/30 bg-[#0a0a0a] hover:border-[#52525b]/70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-4 h-4 border flex items-center justify-center transition-all duration-300 ${
                          formData.paymentMethod === 'nagad'
                            ? 'border-white bg-white'
                            : 'border-[#52525b]/60 bg-transparent'
                        }`}
                      >
                        {formData.paymentMethod === 'nagad' && (
                          <div className="w-2 h-2 bg-black" />
                        )}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Nagad
                      </span>
                    </div>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nagad"
                      checked={formData.paymentMethod === 'nagad'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {/* bKash Panel */}
                {formData.paymentMethod === 'bkash' && (
                  <div className="mt-6 border-t border-[#52525b]/20 pt-6">
                    <div className="space-y-3 text-sm">
                      <p className="text-white font-medium">
                        Send{' '}
                        <span className="font-bold">
                          ৳{orderTotal.toLocaleString()}
                        </span>{' '}
                        to:
                      </p>
                      <p className="font-mono text-lg bg-black px-4 py-3 border border-[#52525b]/30 text-white">
                        01795099068 (Send Money)
                      </p>
                      <p className="text-[#a1a1aa]">
                        After sending the payment, enter the bKash transaction ID
                        below.
                      </p>
                      <input
                        type="text"
                        placeholder="e.g. TRX123456789"
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Nagad Panel */}
                {formData.paymentMethod === 'nagad' && (
                  <div className="mt-6 border-t border-[#52525b]/20 pt-6">
                    <div className="space-y-3 text-sm">
                      <p className="text-white font-medium">
                        Send{' '}
                        <span className="font-bold">
                          ৳{orderTotal.toLocaleString()}
                        </span>{' '}
                        to:
                      </p>
                      <p className="font-mono text-lg bg-black px-4 py-3 border border-[#52525b]/30 text-white">
                        01540366437 (Send Money)
                      </p>
                      <p className="text-[#a1a1aa]">
                        After sending the payment, enter the Nagad transaction ID
                        below.
                      </p>
                      <input
                        type="text"
                        placeholder="e.g. TRX123456789"
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#52525b]/30 rounded px-4 py-3 text-sm focus:outline-none focus:border-white text-white"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Link
                  href="/shop"
                  className="flex-1 py-3 px-6 text-center border border-[#52525b]/50 text-sm uppercase tracking-wider hover:border-white transition"
                >
                  BACK TO SHOP
                </Link>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`flex-1 py-3 px-6 font-bold uppercase tracking-wider text-sm transition ${
                    isProcessing
                      ? 'bg-[#52525b] cursor-not-allowed'
                      : 'bg-white text-black hover:bg-[#d4d4d8]'
                  }`}
                >
                  {isProcessing ? 'PROCESSING...' : 'PLACE ORDER'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="pt-12 pb-14 text-center border-t border-[#52525b]/20">
        <div className="text-[10px] tracking-[0.25em] text-[#52525b] uppercase">
          © 2026 FERAL. All rights reserved.
        </div>
        <div className="text-[9px] font-mono lowercase tracking-normal text-[#52525b]/70 mt-2">
          made by shafbitz
        </div>
      </footer>
    </div>
  );
}