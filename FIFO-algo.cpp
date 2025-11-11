// #include<bits/stdc++.h>
#include <iostream>
using namespace std;

int main() {
  int frames[10], pages[30];
  int total_pages, total_frames, page_fault = 0;
  int k = 0, count = 0;

  cout << "Enter total number of pages: ";
  cin >> total_pages;

  cout << "Enter the page reference for each page: \n";
  for (int i = 0; i < total_pages; i++) {
    cin >> pages[i];
  }

  cout << "Enter total number of frames: ";
  cin >> total_frames;

  for (int i = 0; i < total_frames; i++) frames[i] = -1;

  cout << "\nPage rreplacement process (FIFO): \n";

  for (int i = 0; i < total_pages; i++) {
    int flag = 0;

    for (int j = 0; j < total_frames; j++) {
      if (frames[j] == pages[i]) {
        flag = 1;
        break;
      }
    }

    if (flag == 0) {
      frames[k] = pages[i];
      k = (k + 1) % total_frames;
      page_fault++;
    }

    cout << "\nFor page " << pages[i] << ": ";
    for (int j = 0; j < total_frames; j++) {
      if (frames[j] != -1)
        cout << frames[j] << " ";
      else
        cout << "- ";
    }
  }

  cout << "\n\nTotal Page Faults = " << page_fault;

  return 0;
}




// #include <stdio.h>

// int main() {
//     int frames[10], pages[30], temp[10];
//     int total_pages, total_frames, page_faults = 0;
//     int i, j, k = 0, flag, count = 0;

//     printf("Enter total number of pages: ");
//     scanf("%d", &total_pages);

//     printf("Enter the page reference string:\n");
//     for(i = 0; i < total_pages; i++) {
//         scanf("%d", &pages[i]);
//     }

//     printf("Enter total number of frames: ");
//     scanf("%d", &total_frames);

//     // Initialize frames as empty
//     for(i = 0; i < total_frames; i++)
//         frames[i] = -1;

//     printf("\nPage Replacement Process (FIFO):\n");

//     for(i = 0; i < total_pages; i++) {
//         flag = 0;

//         // Check if page already exists in frames
//         for(j = 0; j < total_frames; j++) {
//             if(frames[j] == pages[i]) {
//                 flag = 1; // Page hit
//                 break;
//             }
//         }

//         if(flag == 0) {
//             // Page fault occurs
//             frames[k] = pages[i];
//             k = (k + 1) % total_frames; // FIFO replacement
//             page_faults++;
//         }

//         // Display current frame status
//         printf("\nFor page %d: ", pages[i]);
//         for(j = 0; j < total_frames; j++) {
//             if(frames[j] != -1)
//                 printf("%d ", frames[j]);
//             else
//                 printf("- ");
//         }
//     }

//     printf("\n\nTotal Page Faults = %d\n", page_faults);

//     return 0;
// }
